import * as markPostService from '../services/mark-post.service';

export const getAllMarkPosts = async (req, res) => {
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
        const userId = req.query.userId || null;
        const postId = req.query.postId || null;
        const postIdFilter = req.query.postIdFilter || null;
        const documentShareId = req.query.documentShareId || null;
        const documentShareIdFilter = req.query.documentShareIdFilter || null;
        
        // Gọi service để lấy danh sách mark-post
        const markPostsData = await markPostService.getAllMarkPosts({
            page,
            pageSize,
            filters,
            sortField,
            sortOrder,
            populate,
            userId,
            postId,
            postIdFilter,
            documentShareId,
            documentShareIdFilter
        });

        // Trả về kết quả
        return res.status(200).json(markPostsData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getMarkPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const markPost = await markPostService.getMarkPostById(id);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin mark-post thành công',
            data: markPost
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const createMarkPost = async (req, res) => {
    try {
        const markPostData = {
            ...req.body,
            user_id: req.user.id // Sử dụng ID của người dùng đã đăng nhập
        };
        
        // Kiểm tra dữ liệu đầu vào
        if (!markPostData.post_id && !markPostData.document_share_id) {
            return res.status(400).json({
                err: -1,
                message: 'Cần cung cấp postId hoặc documentShareId'
            });
        }
        
        const newMarkPost = await markPostService.createMarkPost(markPostData);
        
        return res.status(201).json({
            err: 0,
            message: 'Đánh dấu thành công',
            data: newMarkPost
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const updateMarkPost = async (req, res) => {
    try {
        const { id } = req.params;
        const markPostData = req.body;
        const updatedMarkPost = await markPostService.updateMarkPost(id, markPostData);
        
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật mark-post thành công',
            data: updatedMarkPost
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const deleteMarkPost = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await markPostService.deleteMarkPost(id);
        
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

export const deleteMarkPostByUserAndResource = async (req, res) => {
    try {
        const userId = req.user.id; // Sử dụng ID của người dùng đã đăng nhập
        const { postId, documentShareId } = req.query;
        
        if (!postId && !documentShareId) {
            return res.status(400).json({
                err: -1,
                message: 'Cần cung cấp postId hoặc documentShareId'
            });
        }
        
        const result = await markPostService.deleteMarkPostByUserAndResource(userId, postId, documentShareId);
        
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