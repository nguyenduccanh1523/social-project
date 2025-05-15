import express from 'express';
import * as groupInvitationController from '../../controllers/group/group-invitation.js';
import { verifyToken } from '../../middlewares/auth.js';

const router = express.Router();

// Lấy tất cả lời mời vào nhóm (có phân trang, lọc)
router.get('/', groupInvitationController.getAllGroupInvitations);

// Lấy lời mời vào nhóm theo ID
router.get('/:id', groupInvitationController.getGroupInvitationById);

// Tạo lời mời vào nhóm (yêu cầu đăng nhập)
router.post('/', verifyToken, groupInvitationController.createGroupInvitation);

// Phản hồi lời mời vào nhóm (yêu cầu đăng nhập)
router.put('/:id/respond', verifyToken, groupInvitationController.respondToInvitation);

// Hủy lời mời vào nhóm (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, groupInvitationController.cancelInvitation);

// Lấy danh sách lời mời của một nhóm (yêu cầu đăng nhập)
router.get('/group/:groupId', verifyToken, groupInvitationController.getInvitationsByGroupId);

// Lấy danh sách lời mời của một người dùng (yêu cầu đăng nhập)
router.get('/user/:userId', verifyToken, groupInvitationController.getInvitationsByUserId);

export default router;
