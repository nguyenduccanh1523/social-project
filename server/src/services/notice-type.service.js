import db from '../models';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

// Lấy tất cả notice-types có phân trang và lọc
export const getAllNoticeTypes = async ({
    page = 1,
    pageSize = 10,
    filters = {},
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
}) => {
    try {
        
        const offset = (page - 1) * pageSize;
        const whereConditions = {};

        // Áp dụng các bộ lọc nếu có
        if (filters.name) {
            whereConditions.name = filters.name;
        }

        if (filters.keyword) {
            whereConditions[Op.or] = [
                { name: { [Op.like]: `%${filters.keyword}%` } },
                { description: { [Op.like]: `%${filters.keyword}%` } }
            ];
        }

        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
                {
                    model: db.Notification,
                    as: 'notifications',
                    attributes: ['documentId', 'content', 'is_read']
                },
                {
                    model: db.NotificationSetting,
                    as: 'notificationSettings',
                    attributes: ['documentId', 'is_active']
                }
            );
        }

        // Thực hiện truy vấn
        const { count, rows } = await db.NoticeType.findAndCountAll({
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
        throw new Error(`Lỗi khi lấy danh sách notice-types: ${error.message}`);
    }
};

// Lấy notice-type theo ID
export const getNoticeTypeById = async (documentId) => {
    try {
        const noticeType = await db.NoticeType.findByPk(documentId, {
            include: [
                {
                    model: db.Notification,
                    as: 'notifications',
                    attributes: ['documentId', 'content', 'is_read']
                },
                {
                    model: db.NotificationSetting,
                    as: 'notificationSettings',
                    attributes: ['documentId', 'is_active']
                }
            ]
        });

        if (!noticeType) {
            throw new Error('Không tìm thấy notice-type');
        }

        return noticeType;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin notice-type: ${error.message}`);
    }
};

// Tạo notice-type mới
export const createNoticeType = async (noticeTypeData) => {
    try {
        const newNoticeType = await db.NoticeType.create(noticeTypeData);
        return await getNoticeTypeById(newNoticeType.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi tạo notice-type mới: ${error.message}`);
    }
};

// Cập nhật notice-type
export const updateNoticeType = async (documentId, noticeTypeData) => {
    try {
        const noticeType = await db.NoticeType.findByPk(documentId);
        
        if (!noticeType) {
            throw new Error('Không tìm thấy notice-type');
        }

        await noticeType.update(noticeTypeData);
        return await getNoticeTypeById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật notice-type: ${error.message}`);
    }
};

// Xóa notice-type
export const deleteNoticeType = async (documentId) => {
    try {
        const noticeType = await db.NoticeType.findByPk(documentId);
        
        if (!noticeType) {
            throw new Error('Không tìm thấy notice-type');
        }

        await noticeType.destroy();
        return { message: 'Xóa notice-type thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa notice-type: ${error.message}`);
    }
}; 