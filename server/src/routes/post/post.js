import express from 'express'
import * as postController from '../../controllers/post/post.js'
import { verifyToken } from '../../middlewares/auth.js'

const router = express.Router()

// Lấy tất cả bài viết (có phân trang, lọc)
router.get('/', verifyToken, postController.getAllPosts)

// Lấy bài viết theo ID
router.get('/:id', verifyToken, postController.getPostById)

// Tạo bài viết mới (yêu cầu đăng nhập)
router.post('/', verifyToken, postController.createPost)

// Cập nhật bài viết (yêu cầu đăng nhập)
router.put('/:id', verifyToken, postController.updatePost)

// Xóa bài viết (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, postController.deletePost)

// Thống kê số lượng bài post trong tháng và tỷ lệ tăng/giảm
router.get('/stats/monthly', verifyToken, postController.getMonthlyPostStats)

export default router 