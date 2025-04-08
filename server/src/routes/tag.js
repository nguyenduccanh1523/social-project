import express from 'express'
import * as tagController from '../controllers/tag'
import { verifyToken } from '../middlewares/auth'

const router = express.Router()

// Lấy tất cả tags (có phân trang, lọc)
router.get('/', verifyToken, tagController.getAllTags)

// Lấy tag theo ID
router.get('/:id', verifyToken, tagController.getTagById)

// Tạo tag mới (yêu cầu đăng nhập)
router.post('/', verifyToken, tagController.createTag)

// Cập nhật tag (yêu cầu đăng nhập)
router.put('/:id', verifyToken, tagController.updateTag)

// Xóa tag (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, tagController.deleteTag)

export default router