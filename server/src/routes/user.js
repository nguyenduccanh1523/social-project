import express from 'express'
import * as userController from '../controllers/user'
import { verifyToken, isAdmin } from '../middlewares/auth'

const router = express.Router()

// Lấy tất cả tags (có phân trang, lọc)
router.get('/', verifyToken, isAdmin, userController.getAllUsers)

// Lấy tag theo ID
router.get('/:id', verifyToken, userController.getUserById)

// Tạo tag mới (yêu cầu đăng nhập)
router.post('/', verifyToken, isAdmin, userController.createUser)

// Cập nhật tag (yêu cầu đăng nhập)
router.put('/:id', verifyToken, isAdmin, userController.updateUser)

// Xóa tag (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser)

export default router