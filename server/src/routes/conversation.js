import express from 'express'
import * as conversationController from '../controllers/conversation.js'
import { verifyToken } from '../middlewares/auth.js'

const router = express.Router()

// Lấy tất cả cuộc trò chuyện (có phân trang, lọc)
router.get('/', verifyToken, conversationController.getAllConversations)

// Lấy cuộc trò chuyện theo ID
router.get('/:id', verifyToken, conversationController.getConversationById)

// Tạo cuộc trò chuyện mới (yêu cầu đăng nhập)
router.post('/', verifyToken, conversationController.createConversation)

// Cập nhật cuộc trò chuyện (yêu cầu đăng nhập)
router.put('/:id', verifyToken, conversationController.updateConversation)

// Xóa cuộc trò chuyện (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, conversationController.deleteConversation)

export default router