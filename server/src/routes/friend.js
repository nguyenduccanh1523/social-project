import express from 'express'
import * as friendController from '../controllers/friend.js'
import { verifyToken } from '../middlewares/auth.js'

const router = express.Router()

// Lấy tất cả bạn bè (có phân trang, lọc)
router.get('/', verifyToken, friendController.getAllFriend)

// Lấy danh sách bạn bè và đếm số lượng
router.get('/with-count', verifyToken, friendController.getFriendsWithCount)

// Lấy danh sách bạn bè cập nhật trước 7 ngày
router.get('/updated-before-7-days', verifyToken, friendController.getFriendsUpdatedBefore7Days)

// Lấy danh sách người dùng chưa kết bạn
router.get('/non-friends', verifyToken, friendController.getNonFriendUsers)

// Lấy bạn bè theo ID
router.get('/:id', verifyToken, friendController.getFriendById)

// Tạo bạn bè mới (yêu cầu đăng nhập)
router.post('/', verifyToken, friendController.createFriend)

// Cập nhật bạn bè (yêu cầu đăng nhập)
router.put('/:id', verifyToken, friendController.updateFriend)

// Xóa bạn bè (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, friendController.deleteFriend)

export default router