import db from '../models';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

// Lấy tất cả media có phân trang và lọc
export const getAllMedias = async ({
    page = 1,
    pageSize = 10,
    filters = {},
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
    typeId = null,
    isDeleted = false
}) => {
    try {
        const offset = (page - 1) * pageSize;
        const whereConditions = {};
        
        // Bỏ qua các media đã xóa trừ khi có yêu cầu
        if (!isDeleted) {
            whereConditions.deletedAt = { [Op.is]: null };
        }

        // Áp dụng các bộ lọc nếu có
        if (filters.status) {
            whereConditions.status = filters.status;
        }

        if (filters.keyword) {
            whereConditions[Op.or] = [
                { file_name: { [Op.like]: `%${filters.keyword}%` } },
                { file_path: { [Op.like]: `%${filters.keyword}%` } }
            ];
        }

        // Lọc theo typeId nếu được cung cấp
        if (typeId) {
            whereConditions.type_id = typeId;
        }

        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
                {
                    model: db.Type,
                    as: 'mediaType',
                    attributes: ['documentId', 'name', 'description']
                }
            );
        }

        // Thực hiện truy vấn
        const { count, rows } = await db.Media.findAndCountAll({
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
        throw new Error(`Lỗi khi lấy danh sách media: ${error.message}`);
    }
};

// Lấy media theo ID
export const getMediaById = async (documentId) => {
    try {
        const media = await db.Media.findByPk(documentId, {
            include: [
                {
                    model: db.MediaType,
                    as: 'mediaType',
                    attributes: ['documentId', 'name', 'description']
                }
            ]
        });

        if (!media) {
            throw new Error('Không tìm thấy media');
        }

        return media;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin media: ${error.message}`);
    }
};

// Tạo media mới
export const createMedia = async (mediaData) => {
    try {
        const newMedia = await db.Media.create(mediaData);
        return await getMediaById(newMedia.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi tạo media mới: ${error.message}`);
    }
};

// Cập nhật media
export const updateMedia = async (documentId, mediaData) => {
    try {
        const media = await db.Media.findByPk(documentId);
        
        if (!media) {
            throw new Error('Không tìm thấy media');
        }

        await media.update(mediaData);
        return await getMediaById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật media: ${error.message}`);
    }
};

// Xóa media (soft delete)
export const deleteMedia = async (documentId) => {
    try {
        const media = await db.Media.findByPk(documentId);
        
        if (!media) {
            throw new Error('Không tìm thấy media');
        }

        await media.update({ deletedAt: new Date() });
        return { message: 'Xóa media thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa media: ${error.message}`);
    }
};

// Khôi phục media đã xóa
export const restoreMedia = async (documentId) => {
    try {
        const media = await db.Media.findByPk(documentId);
        
        if (!media) {
            throw new Error('Không tìm thấy media');
        }

        await media.update({ deletedAt: null });
        return { message: 'Khôi phục media thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi khôi phục media: ${error.message}`);
    }
};

// Lấy tất cả post-media có phân trang và lọc
export const getAllPostMedias = async ({
    page = 1,
    pageSize = 10,
    filters = {},
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
    postId = null
}) => {
    try {
        const offset = (page - 1) * pageSize;
        const whereConditions = {};

        // Áp dụng các bộ lọc nếu có
        if (filters.status) {
            whereConditions.status = filters.status;
        }

        // Lọc theo postId nếu được cung cấp
        if (postId) {
            whereConditions.post_id = postId;
        }

        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
                {
                    model: db.Post,
                    as: 'post',
                    attributes: ['documentId', 'content', 'createdAt']
                },
                {
                    model: db.Media,
                    as: 'media',
                    attributes: ['documentId', 'file_path', 'type_id'],
                    include: [
                        {
                            model: db.Type,
                            as: 'mediaType',
                            attributes: ['documentId', 'name']
                        }
                    ]
                }
            );
        }

        // Thực hiện truy vấn
        const { count, rows } = await db.PostMedia.findAndCountAll({
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
        throw new Error(`Lỗi khi lấy danh sách post-media: ${error.message}`);
    }
};

// Lấy post-media theo ID
export const getPostMediaById = async (documentId) => {
    try {
        const postMedia = await db.PostMedia.findByPk(documentId, {
            include: [
                {
                    model: db.Post,
                    as: 'post',
                    attributes: ['documentId', 'content', 'createdAt']
                },
                {
                    model: db.Media,
                    as: 'media',
                    attributes: ['documentId', 'file_name', 'file_path', 'type_id'],
                    include: [
                        {
                            model: db.MediaType,
                            as: 'mediaType',
                            attributes: ['documentId', 'name']
                        }
                    ]
                }
            ]
        });

        if (!postMedia) {
            throw new Error('Không tìm thấy post-media');
        }

        return postMedia;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin post-media: ${error.message}`);
    }
};

// Tạo post-media mới
export const createPostMedia = async (postMediaData) => {
    try {
        const newPostMedia = await db.PostMedia.create(postMediaData);
        return await getPostMediaById(newPostMedia.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi tạo post-media mới: ${error.message}`);
    }
};

// Cập nhật post-media
export const updatePostMedia = async (documentId, postMediaData) => {
    try {
        const postMedia = await db.PostMedia.findByPk(documentId);
        
        if (!postMedia) {
            throw new Error('Không tìm thấy post-media');
        }

        await postMedia.update(postMediaData);
        return await getPostMediaById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật post-media: ${error.message}`);
    }
};

// Xóa post-media
export const deletePostMedia = async (documentId) => {
    try {
        const postMedia = await db.PostMedia.findByPk(documentId);
        
        if (!postMedia) {
            throw new Error('Không tìm thấy post-media');
        }

        await postMedia.destroy();
        return { message: 'Xóa post-media thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa post-media: ${error.message}`);
    }
}; 