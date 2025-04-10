import db from '../models';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

// Lấy tất cả post-tags có phân trang và lọc
export const getAllSupport = async ({
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
        if (filters.status) {
            whereConditions.status = filters.status;
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
                    model: db.Faq,
                    as: 'faqs',
                    attributes: ['documentId', 'question', 'answer']   
                },
                {
                    model: db.Guide,
                    as: 'guides',
                    attributes: ['documentId', 'title', 'content']
                }
            );
        }

        // Thực hiện truy vấn
        const { count, rows } = await db.CategorySupport.findAndCountAll({
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
        throw new Error(`Lỗi khi lấy danh sách support: ${error.message}`);
    }
};

// Lấy post-tag theo ID
export const getSupportById = async (documentId) => {
    try {
        const support = await db.CategorySupport.findByPk(documentId, {
            include: [
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

        if (!support) {
            throw new Error('Không tìm thấy support');
        }

        return support;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin support: ${error.message}`);
    }
};

// Tạo post-tag mới
export const createSupport = async (supportData) => {
    try {
        const newSupport = await db.CategorySupport.create(supportData);
        return await getSupportById(newSupport.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi tạo support mới: ${error.message}`);
    }
};

// Cập nhật post-tag
export const updateSupport = async (documentId, supportData) => {
    try {
        const support = await db.CategorySupport.findByPk(documentId);
        
        if (!support) {
            throw new Error('Không tìm thấy support');
        }

        await support.update(supportData);
        return await getSupportById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật support: ${error.message}`);
    }
};

// Xóa post-tag
export const deleteSupport = async (documentId) => {
    try {
        const support = await db.CategorySupport.findByPk(documentId);
        
        if (!support) {
            throw new Error('Không tìm thấy support');
        }

        await support.destroy();
        return { message: 'Xóa support thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa support: ${error.message}`);
    }
}; 