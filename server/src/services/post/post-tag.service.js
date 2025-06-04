import db from '../../models/index.js';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

// Lấy tất cả post-tags có phân trang và lọc
export const getAllPostTags = async ({
    page = 1,
    pageSize = 10,
    filters = {},
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
    tagId = null,
    pageId = null,
    postId = null,
    document_share_id = null,
    customAttributes = null,
    pageIdNotNull = false,
    includePage = false,
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
        if (tagId) {
            whereConditions.tag_id = tagId;
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

        // Lọc các bản ghi có page_id không null
        if (pageIdNotNull) {
            whereConditions.page_id = {
                [Op.ne]: null
            };
        }

        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
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
            );
        }

        // Thêm include page nếu yêu cầu (cho customAttributes)
        if (includePage && !populate) {
            includes.push({
                model: db.Page,
                as: 'page',
                attributes: ['documentId', 'page_name', 'intro', 'profile_picture', 'rate', 'is_verified'],
                include: [
                    {
                        model: db.Media,
                        as: 'profileImage',
                        attributes: ['documentId', 'file_path'],
                    },
                    {
                        model: db.User,
                        as: 'creator',
                        attributes: ['documentId', 'username', 'email'],
                        include: [
                            {
                                model: db.Media,
                                as: 'avatarMedia',
                                attributes: ['documentId', 'file_path']
                            }
                        ]
                    }
                ]
            });
        }


        // Tạo options cho truy vấn
        const queryOptions = {
            where: whereConditions,
            include: includes,
            order: [[sortField, sortOrder]],
            distinct: true
        };

        // Thêm attributes nếu có customAttributes
        if (customAttributes && Array.isArray(customAttributes) && customAttributes.length > 0) {
            queryOptions.attributes = customAttributes;
        }

        // Thêm phân trang nếu cần
        if (!customAttributes) { // Chỉ phân trang khi không sử dụng customAttributes
            queryOptions.offset = offset;
            queryOptions.limit = pageSize;
        }

        // Thực hiện truy vấn
        if (!customAttributes) {
            // Trường hợp thông thường với phân trang
            const { count, rows } = await db.PostTag.findAndCountAll(queryOptions);

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
        } else {
            // Trường hợp chỉ lấy các trường tùy chỉnh không cần phân trang
            const data = await db.PostTag.findAll(queryOptions);
            return { data };
        }
    } catch (error) {
        throw new Error(`Lỗi khi lấy danh sách post-tags: ${error.message}`);
    }
};

// Lấy post-tag theo ID
export const getPostTagById = async (documentId) => {
    try {
        const postTag = await db.PostTag.findByPk(documentId, {
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

        if (!postTag) {
            throw new Error('Không tìm thấy post-tag');
        }

        return postTag;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin post-tag: ${error.message}`);
    }
};

// Tạo post-tag mới
export const createPostTag = async (postTagData) => {
    try {
        const newPostTag = await db.PostTag.create(postTagData);
        return await getPostTagById(newPostTag.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi tạo post-tag mới: ${error.message}`);
    }
};

// Cập nhật post-tag
export const updatePostTag = async (documentId, postTagData) => {
    try {
        const postTag = await db.PostTag.findByPk(documentId);

        if (!postTag) {
            throw new Error('Không tìm thấy post-tag');
        }

        await postTag.update(postTagData);
        return await getPostTagById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật post-tag: ${error.message}`);
    }
};

// Xóa post-tag
export const deletePostTag = async (documentId) => {
    try {
        const postTag = await db.PostTag.findByPk(documentId);

        if (!postTag) {
            throw new Error('Không tìm thấy post-tag');
        }

        await postTag.destroy({ force: true });
        return { message: 'Xóa post-tag thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa post-tag: ${error.message}`);
    }
};

// Lấy post-tag theo tagId với các trường tùy chỉnh
export const getPostTagsByTagId = async (tagId, attributes = ['page_id']) => {
    try {
        // Kiểm tra nếu tagId không được cung cấp
        if (!tagId) {
            throw new Error('TagId là bắt buộc');
        }

        // Tạo đối tượng options cho truy vấn
        const options = {
            where: {
                tag_id: tagId
            },
            attributes: attributes
        };

        // Thực hiện truy vấn
        const postTags = await db.PostTag.findAll(options);

        return postTags;
    } catch (error) {
        throw new Error(`Lỗi khi lấy post-tags theo tagId: ${error.message}`);
    }
}; 
