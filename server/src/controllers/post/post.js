import * as postService from '../../services/post/post.service.js';

export const getAllPosts = async (req, res) => {
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
        let userId; // Khởi tạo nhưng không gán nếu không có trong query

        if (req.query.status) filters.status = req.query.status;
        if (req.query.keyword) filters.keyword = req.query.keyword;
        if (req.query.userId) {
            filters.userId = req.query.userId;
            userId = req.query.userId; // Chỉ lấy nếu có trong query
        }
        // Nếu không có req.query.userId thì userId sẽ là undefined

        // Lấy groupId trực tiếp từ query parameter
        const groupId = req.query.groupId || null;
        //console.log(`Controller - Đang lọc theo groupId: ${groupId}`);

        // Gọi service để lấy danh sách bài viết, truyền thêm userId và groupId
        const postsData = await postService.getAllPosts({
            page,
            pageSize,
            filters,
            sortField,
            sortOrder,
            populate,
            userId, // Truyền userId từ token vào service
            groupId  // Truyền groupId từ query vào service
        });

        // Trả về kết quả
        return res.status(200).json(postsData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        // Lấy userId từ middleware verifyToken
        const userId = req.userId;

        // Truyền userId vào service
        const post = await postService.getPostById(id, userId);

        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin bài viết thành công',
            data: post
        });
    } catch (error) {
        // Xử lý lỗi quyền truy cập
        if (error.message === 'Bạn không có quyền xem bài viết này') {
            return res.status(403).json({
                err: -1,
                message: error.message
            });
        }

        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const createPost = async (req, res) => {
    try {
        const postData = req.body;
        // const userId = req.userId; // Lấy từ middleware auth

        const newPost = await postService.createPost(postData);

        return res.status(201).json({
            err: 0,
            message: 'Tạo bài viết mới thành công',
            data: newPost
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const postData = req.body;
        const userId = req.userId; // Lấy từ middleware auth

        const updatedPost = await postService.updatePost(id, postData, userId);

        return res.status(200).json({
            err: 0,
            message: 'Cập nhật bài viết thành công',
            data: updatedPost
        });
    } catch (error) {
        // Xử lý lỗi không có quyền
        if (error.message === 'Bạn không có quyền chỉnh sửa bài viết này') {
            return res.status(403).json({
                err: -1,
                message: error.message
            });
        }

        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId; // Lấy từ middleware auth

        const result = await postService.deletePost(id, userId);

        return res.status(200).json({
            err: 0,
            message: result.message
        });
    } catch (error) {
        // Xử lý lỗi không có quyền
        if (error.message === 'Bạn không có quyền xóa bài viết này') {
            return res.status(403).json({
                err: -1,
                message: error.message
            });
        }

        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
}; 