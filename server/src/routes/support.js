import express from 'express'
import * as supportController from '../controllers/support.js'
import { verifyToken } from '../middlewares/auth.js'

const router = express.Router()

// Lấy tất cả tags (có phân trang, lọc)
router.get('/', verifyToken, supportController.getAllSupport)

// Lấy tag theo ID
router.get('/:id', verifyToken, supportController.getSupportById)

// Tạo tag mới (yêu cầu đăng nhập)
router.post('/', verifyToken, supportController.createSupport)

// Cập nhật tag (yêu cầu đăng nhập)
router.put('/:id', verifyToken, supportController.updateSupport)

// Xóa tag (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, supportController.deleteSupport)

export default router