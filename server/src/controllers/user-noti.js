import * as userNotificationService from '../services/user-noti.service';

export const getAllUserNotifications = async (req, res) => {
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
        if (req.query.is_read !== undefined) {
            filters.is_read = req.query.is_read === 'true';
        }

        // Lấy các tham số lọc
        const userId = req.query.userId || null;
        const notificationId = req.query.notificationId || null;

        // Gọi service để lấy danh sách user notification
        const userNotificationsData = await userNotificationService.getAllUserNotifications({
            page,
            pageSize,
            filters,
            sortField,
            sortOrder,
            populate,
            userId,
            notificationId
        });

        // Trả về kết quả
        return res.status(200).json(userNotificationsData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getUserNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const userNotification = await userNotificationService.getUserNotificationById(id);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin thông báo người dùng thành công',
            data: userNotification
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const createUserNotification = async (req, res) => {
    try {
        const userNotificationData = req.body;
        const newUserNotification = await userNotificationService.createUserNotification(userNotificationData);
        
        return res.status(201).json({
            err: 0,
            message: 'Tạo thông báo người dùng mới thành công',
            data: newUserNotification
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const updateUserNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userNotificationData = req.body;
        const updatedUserNotification = await userNotificationService.updateUserNotification(id, userNotificationData);
        
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật thông báo người dùng thành công',
            data: updatedUserNotification
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUserNotification = await userNotificationService.markAsRead(id);
        
        return res.status(200).json({
            err: 0,
            message: 'Đánh dấu thông báo đã đọc thành công',
            data: updatedUserNotification
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                err: -1,
                message: 'Thiếu userId'
            });
        }
        
        const result = await userNotificationService.markAllAsRead(userId);
        
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

export const deleteUserNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userNotificationService.deleteUserNotification(id);
        
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