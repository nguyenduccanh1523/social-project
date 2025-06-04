import db from '../../models/index.js';
import { Op } from 'sequelize';

// Lấy tất cả post-medias có phân trang và lọc
export const getAllPostMedias = async ({
    page = 1,
    pageSize = 10,
    filters = {},
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
    postId = null,
    mediaId = null,
}) => {
    try {
        const offset = (page - 1) * pageSize;
        const whereConditions = {};

        if (filters.keyword) {
            whereConditions[Op.or] = [
                { post_id: { [Op.like]: `%${filters.keyword}%` } },
                { media_id: { [Op.like]: `%${filters.keyword}%` } }
            ];
        }
        if (postId) whereConditions.post_id = postId;
        if (mediaId) whereConditions.media_id = mediaId;

        const includes = [];
        if (populate) {
            includes.push(
                { model: db.Post, as: 'post', attributes: ['documentId', 'content'] },
                { model: db.Media, as: 'media', attributes: ['documentId', 'file_path'] }
            );
        }

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
        throw new Error(`Lỗi khi lấy danh sách post-medias: ${error.message}`);
    }
};

export const getPostMediaById = async (documentId) => {
    try {
        const postMedia = await db.PostMedia.findByPk(documentId, {
            include: [
                { model: db.Post, as: 'post', attributes: ['documentId', 'content'] },
                { model: db.Media, as: 'media', attributes: ['documentId', 'file_path'] }
            ]
        });
        if (!postMedia) throw new Error('Không tìm thấy post-media');
        return postMedia;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin post-media: ${error.message}`);
    }
};

export const createPostMedia = async (data) => {
    try {
        const newPostMedia = await db.PostMedia.create(data);
        return newPostMedia;
    } catch (error) {
        throw new Error(`Lỗi khi tạo post-media mới: ${error.message}`);
    }
};

export const updatePostMedia = async (documentId, data) => {
    try {
        const postMedia = await db.PostMedia.findByPk(documentId);
        if (!postMedia) throw new Error('Không tìm thấy post-media');
        await postMedia.update(data);
        return await getPostMediaById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật post-media: ${error.message}`);
    }
};

export const deletePostMedia = async (documentId) => {
    try {
        const postMedia = await db.PostMedia.findByPk(documentId);
        if (!postMedia) throw new Error('Không tìm thấy post-media');
        await postMedia.destroy({ force: true });
        return { message: 'Xóa post-media thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa post-media: ${error.message}`);
    }
}; 