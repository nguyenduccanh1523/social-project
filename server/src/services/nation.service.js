import db from '../models';
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

        // Thực hiện truy vấn
        const { count, rows } = await db.PostTag.findAndCountAll({
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

        await postTag.destroy();
        return { message: 'Xóa post-tag thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa post-tag: ${error.message}`);
    }
};

export const getAllNations = async ({ page, pageSize, filters, sortField, sortOrder, populate }) => {
    try {
        // Tạo các tùy chọn cho truy vấn
        const options = {
            where: {},
            order: [[sortField, sortOrder]],
            distinct: true
        };

        // Xử lý các bộ lọc
        if (filters) {
            if (filters.status) {
                options.where.status = filters.status;
            }

            if (filters.keyword) {
                options.where = {
                    ...options.where,
                    [Op.or]: [
                        { name: { [Op.like]: `%${filters.keyword}%` } },
                        { slug: { [Op.like]: `%${filters.keyword}%` } }
                    ]
                };
            }
        }

        // Thêm phân trang
        if (page && pageSize) {
            options.offset = (page - 1) * pageSize;
            options.limit = pageSize;
        }

        // Thực hiện truy vấn với đếm tổng số
        const { count, rows } = await db.Nation.findAndCountAll(options);

        // Tính toán thông tin phân trang
        const totalItems = count;
        const totalPages = Math.ceil(totalItems / pageSize);

        // Trả về kết quả
        return {
            data: rows,
            pagination: {
                page,
                pageSize,
                pageCount: totalPages,
                total: totalItems
            }
        };
    } catch (error) {
        throw new Error(`Lỗi khi lấy danh sách quốc gia: ${error.message}`);
    }
};

export const getNationById = async (id) => {
    try {
        const nation = await db.Nation.findByPk(id);
        
        if (!nation) {
            throw new Error('Không tìm thấy quốc gia');
        }
        
        return nation;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin quốc gia: ${error.message}`);
    }
};

export const createNation = async (nationData) => {
    try {
        // Kiểm tra xem quốc gia đã tồn tại chưa
        const existingNation = await db.Nation.findOne({
            where: {
                [Op.or]: [
                    { name: nationData.name },
                    { phoneCode: nationData.phoneCode }
                ]
            }
        });

        if (existingNation) {
            throw new Error('Quốc gia đã tồn tại');
        }

        // Tạo quốc gia mới
        const newNation = await db.Nation.create(nationData);
        return newNation;
    } catch (error) {
        throw new Error(`Lỗi khi tạo quốc gia mới: ${error.message}`);
    }
};

export const updateNation = async (id, nationData) => {
    try {
        // Kiểm tra xem quốc gia có tồn tại không
        const nation = await db.Nation.findByPk(id);
        
        if (!nation) {
            throw new Error('Không tìm thấy quốc gia');
        }

        // Kiểm tra xem tên hoặc slug mới có trùng với quốc gia khác không
        if (nationData.name || nationData.slug) {
            const existingNation = await db.Nation.findOne({
                where: {
                    id: { [Op.ne]: id },
                    [Op.or]: [
                        nationData.name ? { name: nationData.name } : null,
                        nationData.slug ? { slug: nationData.slug } : null
                    ].filter(Boolean)
                }
            });

            if (existingNation) {
                throw new Error('Tên hoặc slug đã được sử dụng bởi quốc gia khác');
            }
        }

        // Cập nhật quốc gia
        await nation.update(nationData);
        
        // Lấy thông tin quốc gia sau khi cập nhật
        const updatedNation = await db.Nation.findByPk(id);
        return updatedNation;
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật quốc gia: ${error.message}`);
    }
};

export const deleteNation = async (id) => {
    try {
        // Kiểm tra xem quốc gia có tồn tại không
        const nation = await db.Nation.findByPk(id);
        
        if (!nation) {
            throw new Error('Không tìm thấy quốc gia');
        }

        // Kiểm tra xem quốc gia có đang được sử dụng không
        // Ví dụ: kiểm tra quan hệ với bảng khác
        // const relatedEntities = await db.SomeRelatedModel.findOne({ where: { nationId: id } });
        // if (relatedEntities) {
        //     throw new Error('Không thể xóa quốc gia đang được sử dụng');
        // }

        // Thực hiện xóa
        await nation.destroy();
        
        return { message: 'Xóa quốc gia thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa quốc gia: ${error.message}`);
    }
}; 