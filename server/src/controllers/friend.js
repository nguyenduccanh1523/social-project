import * as friendService from '../services/friend.service';    

export const getAllFriend = async (req, res) => {
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
        const statusId = req.query.statusId || null;
        const userId = req.query.userId || null;
        const filterDate = req.query.filterDate || null;
        const lastSevenDays = req.query.lastSevenDays === 'true';

        // Gọi service để lấy danh sách post-tags
        const friendsData = await friendService.getAllFriend({
            page,
            pageSize,
            filters,
            sortField,
            sortOrder,
            populate,
            userId,
            statusId,
            filterDate,
            lastSevenDays
        });

        // Trả về kết quả
        return res.status(200).json(friendsData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getFriendsUpdatedBefore7Days = async (req, res) => {
    try {
        // Lấy tham số phân trang từ query
        const pagination = req.query.pagination || {};
        const page = parseInt(pagination.page) || parseInt(req.query.page) || 1;
        const pageSize = parseInt(pagination.pageSize) || parseInt(req.query.pageSize) || 10;

        // Xử lý tham số sort
        const sort = req.query.sort;
        let sortField = 'updatedAt';
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

        // Lấy userId nếu có
        const userId = req.query.userId || null;

        // Gọi service để lấy danh sách bạn bè cập nhật trước 7 ngày
        const friendsData = await friendService.getFriendsUpdatedBefore7Days({
            page,
            pageSize,
            sortField,
            sortOrder,
            populate,
            userId
        });

        // Trả về kết quả
        return res.status(200).json(friendsData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getFriendById = async (req, res) => {
    try {
        const { id } = req.params;
        const friend = await friendService.getFriendById(id);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin bạn bè thành công',
            data: friend
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const createFriend = async (req, res) => {
    try {
        const friendData = req.body;
        const newFriend = await friendService.createFriend(friendData);
        
        return res.status(201).json({
            err: 0,
            message: 'Tạo bạn bè mới thành công',
            data: newFriend
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const updateFriend = async (req, res) => {
    try {
        const { id } = req.params;
        const friendData = req.body;
        const updatedFriend = await friendService.updateFriend(id, friendData);
        
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật bạn bè thành công',
            data: updatedFriend
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const deleteFriend = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await friendService.deleteFriend(id);
        
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