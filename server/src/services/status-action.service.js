import db from '../models';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

// Lấy tất cả post-tags có phân trang và lọc
export const getAllStatusActions = async ({
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
        const { count, rows } = await db.StatusAction.findAndCountAll({
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
        throw new Error(`Lỗi khi lấy danh sách status-actions: ${error.message}`);
    }
};

// Lấy status-action theo ID
export const getStatusActionById = async (documentId) => {
    try {
        const statusAction = await db.StatusAction.findByPk(documentId, {
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

        if (!statusAction) {
            throw new Error('Không tìm thấy status-action');
        }

        return statusAction;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin status-action: ${error.message}`);
    }
};

// Tạo status-action mới
export const createStatusAction = async (statusActionData) => {
    try {
        const newStatusAction = await db.StatusAction.create(statusActionData);
        return await getStatusActionById(newStatusAction.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi tạo status-action mới: ${error.message}`);
    }
};

// Cập nhật status-action
export const updateStatusAction = async (documentId, statusActionData) => {
    try {
        const statusAction = await db.StatusAction.findByPk(documentId);
        
        if (!statusAction) {
            throw new Error('Không tìm thấy status-action');
        }

        await statusAction.update(statusActionData);
        return await getStatusActionById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật status-action: ${error.message}`);
    }
};

// Xóa status-action
export const deleteStatusAction = async (documentId) => {
    try {
        const statusAction = await db.StatusAction.findByPk(documentId);
        
        if (!statusAction) {
            throw new Error('Không tìm thấy status-action');
        }

        await statusAction.destroy();
        return { message: 'Xóa status-action thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa status-action: ${error.message}`);
    }
}; 