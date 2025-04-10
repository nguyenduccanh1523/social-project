import express from 'express'
import * as userNotificationController from '../controllers/user-noti'
import { verifyToken } from '../middlewares/auth'

const router = express.Router()

// Lấy tất cả thông báo người dùng (có phân trang, lọc)
router.get('/', verifyToken, userNotificationController.getAllUserNotifications)

// Lấy thông báo người dùng theo ID
router.get('/:id', verifyToken, userNotificationController.getUserNotificationById)

// Tạo thông báo người dùng mới (yêu cầu đăng nhập)
router.post('/', verifyToken, userNotificationController.createUserNotification)

// Cập nhật thông báo người dùng (yêu cầu đăng nhập)
router.put('/:id', verifyToken, userNotificationController.updateUserNotification)

// Đánh dấu thông báo người dùng đã đọc
router.put('/:id/mark-as-read', verifyToken, userNotificationController.markAsRead)

// Đánh dấu tất cả thông báo người dùng đã đọc
router.put('/mark-all-as-read', verifyToken, userNotificationController.markAllAsRead)

// Xóa thông báo người dùng (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, userNotificationController.deleteUserNotification)

export default router