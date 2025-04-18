import express from 'express'
import * as statusActionController from '../controllers/status-action'
import { verifyToken } from '../middlewares/auth'

const router = express.Router()

// Lấy tất cả tags (có phân trang, lọc)
router.get('/', statusActionController.getAllStatusActions)

// Lấy tag theo ID
router.get('/:id', verifyToken, statusActionController.getStatusActionById)

// Tạo tag mới (yêu cầu đăng nhập)
router.post('/', verifyToken, statusActionController.createStatusAction)

// Cập nhật tag (yêu cầu đăng nhập)
router.put('/:id', verifyToken, statusActionController.updateStatusAction)

// Xóa tag (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, statusActionController.deleteStatusAction)

export default router