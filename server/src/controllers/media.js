import * as mediaService from '../services/media.service';

export const getAllMedias = async (req, res) => {
    try {
        // Lấy tham số phân trang từ query
        const pagination = req.query.pagination || {};
        const page = parseInt(pagination.page) || parseInt(req.query.page) || 1;
        const pageSize = parseInt(pagination.pageSize) || parseInt(req.query.pageSize) || 10;

        // Xử lý tham số sort
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

        // Xử lý populate
        const populate = req.query.populate === '*' ? true : false;

        // Xây dựng bộ lọc từ query params
        const filters = {};
        if (req.query.status) filters.status = req.query.status;
        if (req.query.keyword) filters.keyword = req.query.keyword;

        // Lấy các tham số lọc
        const typeId = req.query.typeId || null;
        const isDeleted = req.query.isDeleted === 'true';

        // Gọi service để lấy danh sách media
        const mediaData = await mediaService.getAllMedias({
            page,
            pageSize,
            filters,
            sortField,
            sortOrder,
            populate,
            typeId,
            isDeleted
        });

        // Trả về kết quả
        return res.status(200).json(mediaData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getMediaById = async (req, res) => {
    try {
        const { id } = req.params;
        const media = await mediaService.getMediaById(id);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin media thành công',
            data: media
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const createMedia = async (req, res) => {
    try {
        const mediaData = req.body;
        const newMedia = await mediaService.createMedia(mediaData);
        
        return res.status(201).json({
            err: 0,
            message: 'Tạo media mới thành công',
            data: newMedia
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const updateMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const mediaData = req.body;
        const updatedMedia = await mediaService.updateMedia(id, mediaData);
        
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật media thành công',
            data: updatedMedia
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await mediaService.deleteMedia(id);
        
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

export const restoreMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await mediaService.restoreMedia(id);
        
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

export const getAllPostMedias = async (req, res) => {
    try {
        // Lấy tham số phân trang từ query
        const pagination = req.query.pagination || {};
        const page = parseInt(pagination.page) || parseInt(req.query.page) || 1;
        const pageSize = parseInt(pagination.pageSize) || parseInt(req.query.pageSize) || 10;

        // Xử lý tham số sort
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

        // Xử lý populate
        const populate = req.query.populate === '*' ? true : false;

        // Xây dựng bộ lọc từ query params
        const filters = {};
        if (req.query.status) filters.status = req.query.status;

        // Lấy các tham số lọc
        const postId = req.query.postId || null;

        // Gọi service để lấy danh sách post-media
        const postMediaData = await mediaService.getAllPostMedias({
            page,
            pageSize,
            filters,
            sortField,
            sortOrder,
            populate,
            postId
        });

        // Trả về kết quả
        return res.status(200).json(postMediaData);
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
        const postMedia = await mediaService.getPostMediaById(id);
        
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
        const newPostMedia = await mediaService.createPostMedia(postMediaData);
        
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
        const updatedPostMedia = await mediaService.updatePostMedia(id, postMediaData);
        
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
        const result = await mediaService.deletePostMedia(id);
        
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