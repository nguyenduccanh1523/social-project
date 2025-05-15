import express from 'express'
import * as noticeTypeController from '../controllers/notice-type.js'
import { verifyToken } from '../middlewares/auth.js'

const router = express.Router()

// Lấy tất cả notice-types (có phân trang, lọc)
router.get('/', noticeTypeController.getAllNoticeTypes)

// Lấy notice-type theo ID
router.get('/:id', verifyToken, noticeTypeController.getNoticeTypeById)

// Tạo notice-type mới (yêu cầu đăng nhập)
router.post('/', verifyToken, noticeTypeController.createNoticeType)

// Cập nhật notice-type (yêu cầu đăng nhập)
router.put('/:id', verifyToken, noticeTypeController.updateNoticeType)

// Xóa notice-type (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, noticeTypeController.deleteNoticeType)

export default router 