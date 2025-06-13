import express from 'express';
import * as conversationParticipantController from '../controllers/conversation-participant.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router({ mergeParams: true }); // mergeParams để có thể truy cập params từ route cha

// Lấy tất cả thành viên của một cuộc trò chuyện
router.get('/', verifyToken, conversationParticipantController.getAllParticipants);

// Lấy thông tin một thành viên
router.get('/:id', verifyToken, conversationParticipantController.getParticipantById);

// Thêm thành viên mới vào cuộc trò chuyện
router.post('/', verifyToken, conversationParticipantController.addParticipant);

// Cập nhật thông tin thành viên
router.put('/:id', verifyToken, conversationParticipantController.updateParticipant);

// Xóa thành viên khỏi cuộc trò chuyện
router.delete('/:id', verifyToken, conversationParticipantController.removeParticipant);

export default router; 