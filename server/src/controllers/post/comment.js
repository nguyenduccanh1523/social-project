import * as commentService from '../../services/post/comment.service.js';

export const getAllComments = async (req, res) => {
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
        const parent_id = req.query.parent_id !== undefined ? req.query.parent_id : null;
        const post_id = req.query.post_id || null;

        // Gọi service để lấy danh sách comment
        const commentsData = await commentService.getAllComments({
            page,
            pageSize,
            filters,
            sortField,
            sortOrder,
            populate,
            parent_id,
            post_id,
        });

        // Trả về kết quả
        return res.status(200).json(commentsData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getCommentById = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await commentService.getCommentById(id);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin comment thành công',
            data: comment
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const createComment = async (req, res) => {
    try {
        const commentData = req.body;
        const newComment = await commentService.createComment(commentData);
        
        return res.status(201).json({
            err: 0,
            message: 'Tạo comment mới thành công',
            data: newComment
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const commentData = req.body;
        const updatedComment = await commentService.updateComment(id, commentData);
        
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật comment thành công',
            data: updatedComment
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await commentService.deleteComment(id);
        
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