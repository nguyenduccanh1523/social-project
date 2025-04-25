import * as reactionService from '../../services/post/reaction.service';

export const getAllReactions = async (req, res) => {
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
        const userId = req.query.userId || null;
        const type = req.query.type || null;

        // Gọi service để lấy danh sách reaction
        const reactionsData = await reactionService.getAllReactions({
            page,
            pageSize,
            filters,
            sortField,
            sortOrder,
            populate,
            postId,
            userId,
            type
        });

        // Trả về kết quả
        return res.status(200).json(reactionsData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getReactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const reaction = await reactionService.getReactionById(id);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin reaction thành công',
            data: reaction
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};


export const createReaction = async (req, res) => {
    try {
        const reactionData = req.body;
        
        // Đảm bảo có đủ dữ liệu cần thiết
        if (!reactionData.post_id || !reactionData.user_id || !reactionData.type) {
            return res.status(400).json({
                err: -1,
                message: 'Thiếu thông tin cần thiết (post_id, user_id, type)'
            });
        }
        
        const newReaction = await reactionService.createReaction(reactionData);
        
        return res.status(201).json({
            err: 0,
            message: 'Tạo/cập nhật reaction thành công',
            data: newReaction
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const updateReaction = async (req, res) => {
    try {
        const { id } = req.params;
        const reactionData = req.body;
        const updatedReaction = await reactionService.updateReaction(id, reactionData);
        
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật reaction thành công',
            data: updatedReaction
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const deleteReaction = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await reactionService.deleteReaction(id);
        
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

export const deleteReactionByPostAndUser = async (req, res) => {
    try {
        const { postId, userId } = req.query;
        
        if (!postId || !userId) {
            return res.status(400).json({
                err: -1,
                message: 'Thiếu tham số postId hoặc userId'
            });
        }
        
        const result = await reactionService.deleteReactionByPostAndUser(postId, userId);
        
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