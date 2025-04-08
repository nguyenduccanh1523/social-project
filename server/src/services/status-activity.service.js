import db from '../models';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

// Lấy tất cả post-tags có phân trang và lọc
export const getAllStatusActivities = async ({
    page = 1,
    pageSize = 10,
    filters = {},
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
    typeId = null,
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

        // Lọc theo tagId nếu được cung cấp
        if (typeId) {
            whereConditions.type_id = typeId;
        }

        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
                {
                    model: db.Type,
                    as: 'type',
                    attributes: ['documentId', 'name', 'description']
                },
                {
                    model: db.User,
                    as: 'users',
                    attributes: ['documentId', 'fullname', 'email']
                }
            );
        }

        // Thực hiện truy vấn
        const { count, rows } = await db.StatusActivity.findAndCountAll({
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
        throw new Error(`Lỗi khi lấy danh sách status-activities: ${error.message}`);
    }
};

// Lấy status-activity theo ID
export const getStatusActivityById = async (documentId) => {
    try {
        const statusActivity = await db.StatusActivity.findByPk(documentId, {
            include: [
                {
                    model: db.Tag,
                    as: 'tag',
                    attributes: ['documentId', 'name', 'description']
                },
                {
                    model: db.Post,
                    as: 'post',
                    attributes: ['documentId', 'content']
                },
                {
                    model: db.Page,
                    as: 'page',
                    attributes: ['documentId', 'page_name']
                },
                {
                    model: db.DocumentShare,
                    as: 'documentShare',
                    attributes: ['documentId', 'title']
                }
            ]
        });

        if (!statusActivity) {
            throw new Error('Không tìm thấy status-activity');
        }

        return statusActivity;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin status-activity: ${error.message}`);
    }
};

// Tạo status-activity mới
export const createStatusActivity = async (statusActivityData) => {
    try {
        const newStatusActivity = await db.StatusActivity.create(statusActivityData);
        return await getStatusActivityById(newStatusActivity.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi tạo status-activity mới: ${error.message}`);
    }
};

// Cập nhật status-activity
export const updateStatusActivity = async (documentId, statusActivityData) => {
    try {
        const statusActivity = await db.StatusActivity.findByPk(documentId);
        
        if (!statusActivity) {
            throw new Error('Không tìm thấy status-activity');
        }

        await statusActivity.update(statusActivityData);
        return await getStatusActivityById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật status-activity: ${error.message}`);
    }
};

// Xóa status-activity
export const deleteStatusActivity = async (documentId) => {
    try {
        const statusActivity = await db.StatusActivity.findByPk(documentId);
        
        if (!statusActivity) {
            throw new Error('Không tìm thấy status-activity');
        }

        await postTag.destroy();
        return { message: 'Xóa status-activity thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa status-activity: ${error.message}`);
    }
}; 