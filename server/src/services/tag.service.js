import db from '../models';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

// Lấy tất cả bài viết có phân trang
export const getAllTags = async ({
    page = 1,
    pageSize = 10,
    filters = {},
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
    pageId = null,
    postId = null,
    document_share_id = null
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

        // Lọc theo pageId nếu được cung cấp
        if (pageId) {
            whereConditions.page_id = pageId;
        }

        // Lọc theo postId nếu được cung cấp
        if (postId) {
            whereConditions.post_id = postId;
        }

        // Lọc theo document_share_id nếu được cung cấp
        if (document_share_id) {
            whereConditions.document_share_id = document_share_id;
        }

        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
                {
                    model: db.PostTag,
                    as: 'postTags',
                    attributes: ['documentId', 'createdAt', 'updatedAt'],
                    include: [
                        {
                            model: db.Post,
                            as: 'post',
                            attributes: ['documentId', 'content']
                        },
                        {
                            model: db.DocumentShare,
                            as: 'documentShare',
                            attributes: ['documentId', 'title']
                        },
                        {
                            model: db.Page,
                            as: 'page',
                            attributes: ['documentId', 'page_name']
                        }
                    ]
                }
            );
        }

        // Thực hiện truy vấn
        const { count, rows } = await db.Tag.findAndCountAll({
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
        throw new Error(`Lỗi khi lấy danh sách tags: ${error.message}`);
    }
};

// Lấy bài viết theo ID
export const getTagById = async (documentId) => {
    try {
        const tag = await db.Tag.findByPk(documentId, {
            include: [
                {
                    model: db.Post,
                    as: 'posts',
                    attributes: ['documentId', 'title', 'content'],
                    through: {
                        attributes: []
                    }
                },
                {
                    model: db.Page,
                    as: 'pages',
                    attributes: ['documentId', 'page_name'],
                    through: {
                        attributes: []
                    }
                },
                {
                    model: db.DocumentShare,
                    as: 'documentShares',
                    attributes: ['documentId', 'title'],
                    through: {
                        attributes: []
                    }
                }
            ]
        });

        if (!tag) {
            throw new Error('Không tìm thấy tag');
        }

        return tag;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin tag: ${error.message}`);
    }
};

// Tạo bài viết mới
export const createTag = async (tagData) => {
    try {
        const newTag = await db.Tag.create(tagData);
        return newTag;
    } catch (error) {
        throw new Error(`Lỗi khi tạo tag mới: ${error.message}`);
    }
};

// Cập nhật bài viết
export const updateTag = async (documentId, tagData) => {
    try {
        const tag = await db.Tag.findByPk(documentId);
        
        if (!tag) {
            throw new Error('Không tìm thấy tag');
        }

        await tag.update(tagData);
        return tag;
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật tag: ${error.message}`);
    }
};

// Xóa bài viết
export const deleteTag = async (documentId) => {
    try {
        const tag = await db.Tag.findByPk(documentId);
        
        if (!tag) {
            throw new Error('Không tìm thấy tag');
        }

        await tag.destroy();
        return { message: 'Xóa tag thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa tag: ${error.message}`);
    }
}; 