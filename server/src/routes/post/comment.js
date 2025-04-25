import express from 'express'
import * as commentController from '../../controllers/post/comment'
import { verifyToken } from '../../middlewares/auth'

const router = express.Router()

// Lấy tất cả comment (có phân trang, lọc)
router.get('/', verifyToken, commentController.getAllComments)

// Lấy comment theo ID
router.get('/:id', verifyToken, commentController.getCommentById)

// Tạo comment mới (yêu cầu đăng nhập)
router.post('/', verifyToken, commentController.createComment)

// Cập nhật comment (yêu cầu đăng nhập)
router.put('/:id', verifyToken, commentController.updateComment)

// Xóa comment (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, commentController.deleteComment)

export default router