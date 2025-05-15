import express from 'express'
import * as statusActivityController from '../controllers/status-activity.js'
import { verifyToken } from '../middlewares/auth.js'

const router = express.Router()

// Lấy tất cả tags (có phân trang, lọc)
router.get('/', statusActivityController.getAllStatusActivities)

// Lấy tag theo ID
router.get('/:id', verifyToken, statusActivityController.getStatusActivityById)

// Tạo tag mới (yêu cầu đăng nhập)
router.post('/', verifyToken, statusActivityController.createStatusActivity)

// Cập nhật tag (yêu cầu đăng nhập)
router.put('/:id', verifyToken, statusActivityController.updateStatusActivity)

// Xóa tag (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, statusActivityController.deleteStatusActivity)

export default router