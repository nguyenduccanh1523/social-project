import express from 'express'
import * as friendController from '../controllers/friend'
import { verifyToken } from '../middlewares/auth'

const router = express.Router()

// Lấy tất cả tags (có phân trang, lọc)
router.get('/', verifyToken, friendController.getAllFriend)

// Lấy danh sách bạn bè cập nhật trước 7 ngày
router.get('/updated-before-7-days', verifyToken, friendController.getFriendsUpdatedBefore7Days)

// Lấy tag theo ID
router.get('/:id', verifyToken, friendController.getFriendById)

// Tạo tag mới (yêu cầu đăng nhập)
router.post('/', verifyToken, friendController.createFriend)

// Cập nhật tag (yêu cầu đăng nhập)
router.put('/:id', verifyToken, friendController.updateFriend)

// Xóa tag (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, friendController.deleteFriend)

export default router