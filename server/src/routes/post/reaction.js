import express from 'express'
import * as reactionController from '../../controllers/post/reaction.js'
import { verifyToken } from '../../middlewares/auth.js'

const router = express.Router()

// Lấy tất cả reaction (có phân trang, lọc)
router.get('/', verifyToken, reactionController.getAllReactions)

// Lấy reaction theo ID
router.get('/:id', verifyToken, reactionController.getReactionById)

// Tạo reaction mới hoặc cập nhật nếu đã tồn tại (yêu cầu đăng nhập)
router.post('/', verifyToken, reactionController.createReaction)

// Cập nhật reaction (yêu cầu đăng nhập)
router.put('/:id', verifyToken, reactionController.updateReaction)

// Xóa reaction theo ID (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, reactionController.deleteReaction)

// Xóa reaction theo postId và userId (yêu cầu đăng nhập)
router.delete('/post-user', verifyToken, reactionController.deleteReactionByPostAndUser)

router.get('/stats/monthly', verifyToken, reactionController.getMonthlyReactionStats)

export default router
