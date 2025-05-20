import * as postMediaService from '../../services/post/post-media.service.js';

export const getAllPostMedias = async (req, res) => {
    try {
        const pagination = req.query.pagination || {};
        const page = parseInt(pagination.page) || parseInt(req.query.page) || 1;
        const pageSize = parseInt(pagination.pageSize) || parseInt(req.query.pageSize) || 10;

        const sort = req.query.sort;
        let sortField = 'createdAt';
        let sortOrder = 'DESC';
        if (sort) {
            const sortParts = sort.split(':');
            if (sortParts.length === 2) {
                sortField = sortParts[0];
                sortOrder = sortParts[1].toUpperCase();
            }
        }

        const populate = req.query.populate === '*' ? true : false;
        const filters = {};
        if (req.query.keyword) filters.keyword = req.query.keyword;

        const postId = req.query.postId || null;
        const mediaId = req.query.mediaId || null;

        const postMediasData = await postMediaService.getAllPostMedias({
            page,
            pageSize,
            filters,
            sortField,
            sortOrder,
            populate,
            postId,
            mediaId
        });

        return res.status(200).json(postMediasData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getPostMediaById = async (req, res) => {
    try {
        const { id } = req.params;
        const postMedia = await postMediaService.getPostMediaById(id);
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin post-media thành công',
            data: postMedia
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const createPostMedia = async (req, res) => {
    try {
        const postMediaData = req.body;
        const newPostMedia = await postMediaService.createPostMedia(postMediaData);
        return res.status(201).json({
            err: 0,
            message: 'Tạo post-media mới thành công',
            data: newPostMedia
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const updatePostMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const postMediaData = req.body;
        const updatedPostMedia = await postMediaService.updatePostMedia(id, postMediaData);
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật post-media thành công',
            data: updatedPostMedia
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const deletePostMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await postMediaService.deletePostMedia(id);
        return res.status(200).json({
            err: 0,
            message: result.message
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
}; 