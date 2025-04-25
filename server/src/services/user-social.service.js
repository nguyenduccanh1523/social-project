import db from '../models';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

// Lấy tất cả user-socials có phân trang và lọc
export const getAllUserSocials = async ({
    page = 1,
    pageSize = 10,
    filters = {},
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
    userId = null
}) => {
    try {
        
        const offset = (page - 1) * pageSize;
        const whereConditions = {};

        // Áp dụng các bộ lọc nếu có
        if (filters.status) {
            whereConditions.status = filters.status;
        }

        if (filters.keyword) {
            whereConditions[Op.or] = [
                { name: { [Op.like]: `%${filters.keyword}%` } },
                { description: { [Op.like]: `%${filters.keyword}%` } }
            ];
        }

        // Lọc theo userId nếu được cung cấp
        if (userId) {
            whereConditions.user_id = userId;
        }

        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['documentId', 'username', 'email', 'fullname']
                },
                {
                    model: db.Social,
                    as: 'social',
                    attributes: ['documentId', 'platform']
                }
            );
        }

        // Thực hiện truy vấn
        const { count, rows } = await db.userSocial.findAndCountAll({
            where: whereConditions,
            include: includes,
            order: [[sortField, sortOrder]],
            offset,
            limit: pageSize,
            distinct: true
        });

        return {
            data: rows,
            meta: {
                pagination: {
                    page: parseInt(page),
                    pageSize: parseInt(pageSize),
                    pageCount: Math.ceil(count / pageSize),
                    total: count
                }
            }
        };
    } catch (error) {
        throw new Error(`Lỗi khi lấy danh sách user-socials: ${error.message}`);
    }
};

// Lấy user-social theo ID
export const getUserSocialById = async (documentId) => {
    try {
        const userSocial = await db.userSocial.findByPk(documentId, {
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['documentId', 'username', 'email', 'fullname']
                },
                {
                    model: db.Social,
                    as: 'social',
                    attributes: ['documentId', 'platform']
                }
            ]
        });

        if (!userSocial) {
            throw new Error('Không tìm thấy user-social');
        }

        return userSocial;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin user-social: ${error.message}`);
    }
};

// Tạo user-social mới
export const createUserSocial = async (userSocialData) => {
    try {
        const newUserSocial = await db.userSocial.create(userSocialData);
        return await getUserSocialById(newUserSocial.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi tạo user-social mới: ${error.message}`);
    }
};

// Cập nhật user-social
export const updateUserSocial = async (documentId, userSocialData) => {
    try {
        const userSocial = await db.userSocial.findByPk(documentId);
        
        if (!userSocial) {
            throw new Error('Không tìm thấy user-social');
        }

        await userSocial.update(userSocialData);
        return await getUserSocialById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật user-social: ${error.message}`);
    }
};

// Xóa user-social
export const deleteUserSocial = async (documentId) => {
    try {
        const userSocial = await db.userSocial.findByPk(documentId);
        
        if (!userSocial) {
            throw new Error('Không tìm thấy user-social');
        }

        await userSocial.destroy();
        return { message: 'Xóa user-social thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa user-social: ${error.message}`);
    }
}; 