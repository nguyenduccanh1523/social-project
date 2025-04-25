import express from 'express'
import * as markPostController from '../../controllers/post/mark-post'
import { verifyToken } from '../../middlewares/auth'

const router = express.Router()

// Lấy tất cả mark-post (có phân trang, lọc)
router.get('/', verifyToken, markPostController.getAllMarkPosts)

// Lấy mark-post theo ID
router.get('/:id', verifyToken, markPostController.getMarkPostById)

// Tạo mark-post mới (yêu cầu đăng nhập)
router.post('/', verifyToken, markPostController.createMarkPost)

// Cập nhật mark-post (yêu cầu đăng nhập)
router.put('/:id', verifyToken, markPostController.updateMarkPost)

// Xóa mark-post theo ID (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, markPostController.deleteMarkPost)

// Xóa mark-post theo userId và postId/documentShareId (yêu cầu đăng nhập)
router.delete('/user-resource', verifyToken, markPostController.deleteMarkPostByUserAndResource)

export default router