import * as storyService from '../services/story.service';

export const getAllStories = async (req, res) => {
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
        if (req.query.story_type) filters.story_type = req.query.story_type;
        if (req.query.keyword) filters.keyword = req.query.keyword;
        if (req.query.status_story) filters.status_story = req.query.status_story;

        // Lấy các tham số lọc
        const userId = req.query.userId || null;
        const status = req.query.status || 'active'; // Mặc định là active nếu không có

        // Gọi service để lấy danh sách stories
        const storiesData = await storyService.getAllStories({
            page,
            pageSize,
            filters,
            sortField,
            sortOrder,
            populate,
            userId,
            status
        });

        // Trả về kết quả
        return res.status(200).json(storiesData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getStoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const story = await storyService.getStoryById(id);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin story thành công',
            data: story
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const createStory = async (req, res) => {
    try {
        const storyData = req.body;
        
        // Thêm user_id từ người dùng đã xác thực
        storyData.user_id = req.user.documentId;
        
        const newStory = await storyService.createStory(storyData);
        
        return res.status(201).json({
            err: 0,
            message: 'Tạo story mới thành công',
            data: newStory
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const updateStory = async (req, res) => {
    try {
        const { id } = req.params;
        const storyData = req.body;
        
        // Kiểm tra quyền cập nhật story (có thể thêm logic kiểm tra ở đây)
        
        const updatedStory = await storyService.updateStory(id, storyData);
        
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật story thành công',
            data: updatedStory
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const deleteStory = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Kiểm tra quyền xóa story (có thể thêm logic kiểm tra ở đây)
        
        const result = await storyService.deleteStory(id);
        
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

export const viewStory = async (req, res) => {
    try {
        const viewData = {
            user_id: req.user.documentId,
            story_id: req.params.id
        };
        
        const view = await storyService.viewStory(viewData);
        
        return res.status(200).json({
            err: 0,
            message: 'Đánh dấu story đã xem thành công',
            data: view
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const getStoryViewers = async (req, res) => {
    try {
        const { id } = req.params;
        
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
        
        const viewersData = await storyService.getStoryViewers(id, {
            page,
            pageSize,
            sortField,
            sortOrder
        });
        
        return res.status(200).json(viewersData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
}; 