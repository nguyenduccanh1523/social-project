import express from 'express'
import * as messageController from '../controllers/messager.js'
import { verifyToken } from '../middlewares/auth.js'

const router = express.Router()

// Lấy tất cả tin nhắn (có phân trang, lọc)
router.get('/', verifyToken, messageController.getAllMessages)

// Lấy tin nhắn theo ID
router.get('/:id', verifyToken, messageController.getMessageById)

// Tạo tin nhắn mới (yêu cầu đăng nhập)
router.post('/', verifyToken, messageController.createMessage)

// Cập nhật tin nhắn (yêu cầu đăng nhập)
router.put('/:id', verifyToken, messageController.updateMessage)

// Xóa tin nhắn (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, messageController.deleteMessage)

// Đánh dấu tin nhắn đã đọc (yêu cầu đăng nhập)
router.post('/mark-as-read', verifyToken, messageController.markMessagesAsRead)

// Đếm số tin nhắn chưa đọc (yêu cầu đăng nhập)
router.get('/unread/count', verifyToken, messageController.countUnreadMessages)

export default router