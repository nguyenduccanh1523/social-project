import express from 'express'
import * as userController from '../controllers/user.js'
import { verifyToken, isAdmin } from '../middlewares/auth.js'

const router = express.Router()

// Lấy thống kê user
router.get('/statistics', verifyToken, isAdmin, userController.getUserStatistics)

// Lấy thống kê user theo quốc gia
router.get('/nation-statistics', verifyToken, isAdmin, userController.getNationStatistics)

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