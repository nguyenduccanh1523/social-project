import db from '../../models/index.js';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

// Lấy tất cả mark-post có phân trang và lọc
export const getAllMarkPosts = async ({
    page = 1,
    pageSize = 10,
    filters = {},
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
    userId = null,
    postId = null,
    postIdFilter = null,
    documentShareId = null,
    documentShareIdFilter = null
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

        // Xử lý lọc theo postId
        if (postIdFilter === 'true') {
            // Lấy tất cả mark post có postId (không null)
            whereConditions.post_id = { [Op.ne]: null };
        } else if (postIdFilter === 'false') {
            // Lấy tất cả mark post không có postId (null)
            whereConditions.post_id = { [Op.is]: null };
        } else if (postId) {
            // Lấy mark post theo postId cụ thể
            whereConditions.post_id = postId;
        }

        // Xử lý lọc theo documentShareId
        if (documentShareIdFilter === 'true') {
            // Lấy tất cả mark post có documentShareId (không null)
            whereConditions.document_share_id = { [Op.ne]: null };
        } else if (documentShareIdFilter === 'false') {
            // Lấy tất cả mark post không có documentShareId (null)
            whereConditions.document_share_id = { [Op.is]: null };
        } else if (documentShareId) {
            // Lấy mark post theo documentShareId cụ thể
            whereConditions.document_share_id = documentShareId;
        }

        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['documentId', 'username', 'email', 'avatar_id'],
                    include: [
                        {
                            model: db.Media,
                            as: 'avatarMedia',
                            attributes: ['file_path']
                        }
                    ]
                },
                {
                    model: db.Post,
                    as: 'post',
                    attributes: ['documentId', 'content', 'createdAt']
                },
                {
                    model: db.DocumentShare,
                    as: 'documentShare',
                    attributes: ['documentId', 'title', 'createdAt']
                }
            );
        }

        // Thực hiện truy vấn
        const { count, rows } = await db.MarkPost.findAndCountAll({
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
        throw new Error(`Lỗi khi lấy danh sách mark-post: ${error.message}`);
    }
};

// Lấy mark-post theo ID
export const getMarkPostById = async (documentId) => {
    try {
        const markPost = await db.MarkPost.findByPk(documentId, {
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['documentId', 'username', 'email', 'avatar_id'],
                    include: [
                        {
                            model: db.Media,
                            as: 'avatarMedia',
                            attributes: ['documentId', 'file_path']
                        }
                    ]
                },
                {
                    model: db.Post,
                    as: 'post',
                    attributes: ['documentId', 'content', 'createdAt']
                },
                {
                    model: db.DocumentShare,
                    as: 'documentShare',
                    attributes: ['documentId', 'title', 'createdAt']
                }
            ]
        });

        if (!markPost) {
            throw new Error('Không tìm thấy mark-post');
        }

        return markPost;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin mark-post: ${error.message}`);
    }
};

// Tạo mark-post mới
export const createMarkPost = async (markPostData) => {
    try {
        // Kiểm tra xem đã có mark-post cho user_id và post_id/document_share_id này chưa
        let existingMarkPost = null;
        
        if (markPostData.post_id) {
            existingMarkPost = await db.MarkPost.findOne({
                where: {
                    user_id: markPostData.user_id,
                    post_id: markPostData.post_id
                }
            });
        } else if (markPostData.document_share_id) {
            existingMarkPost = await db.MarkPost.findOne({
                where: {
                    user_id: markPostData.user_id,
                    document_share_id: markPostData.document_share_id
                }
            });
        }
        
        if (existingMarkPost) {
            throw new Error('Người dùng đã đánh dấu bài viết/tài liệu này');
        }
        
        const newMarkPost = await db.MarkPost.create(markPostData);
        return await getMarkPostById(newMarkPost.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi tạo mark-post mới: ${error.message}`);
    }
};

// Cập nhật mark-post
export const updateMarkPost = async (documentId, markPostData) => {
    try {
        const markPost = await db.MarkPost.findByPk(documentId);
        
        if (!markPost) {
            throw new Error('Không tìm thấy mark-post');
        }

        await markPost.update(markPostData);
        return await getMarkPostById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật mark-post: ${error.message}`);
    }
};

// Xóa mark-post
export const deleteMarkPost = async (documentId) => {
    try {
        const markPost = await db.MarkPost.findByPk(documentId);
        
        if (!markPost) {
            throw new Error('Không tìm thấy mark-post');
        }

        await markPost.destroy();
        return { message: 'Xóa mark-post thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa mark-post: ${error.message}`);
    }
};

// Xóa mark-post theo userId và postId hoặc documentShareId
export const deleteMarkPostByUserAndResource = async (userId, postId, documentShareId) => {
    try {
        const whereConditions = { user_id: userId };
        
        if (postId) {
            whereConditions.post_id = postId;
        } else if (documentShareId) {
            whereConditions.document_share_id = documentShareId;
        } else {
            throw new Error('Cần cung cấp postId hoặc documentShareId');
        }
        
        const markPost = await db.MarkPost.findOne({ where: whereConditions });
        
        if (!markPost) {
            throw new Error('Không tìm thấy mark-post');
        }
        
        await markPost.destroy();
        return { message: 'Xóa mark-post thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa mark-post: ${error.message}`);
    }
}; 