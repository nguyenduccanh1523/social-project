import express from 'express';
import * as groupMemberController from '../../controllers/group/group-member';
import { verifyToken } from '../../middlewares/auth';

const router = express.Router();

// Lấy tất cả thành viên nhóm (có phân trang, lọc)
router.get('/', groupMemberController.getAllGroupMembers);

// Lấy thành viên nhóm theo ID
router.get('/:id', groupMemberController.getGroupMemberById);

// Thêm thành viên vào nhóm (yêu cầu đăng nhập)
router.post('/', verifyToken, groupMemberController.addGroupMember);

// Xóa thành viên khỏi nhóm (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, groupMemberController.removeGroupMember);

// Lấy danh sách thành viên của một nhóm
router.get('/group/:groupId', groupMemberController.getGroupMembersByGroupId);

// Lấy danh sách nhóm mà một người dùng tham gia
router.get('/user/:userId', groupMemberController.getGroupMembersByUserId);

// Kiểm tra xem một người dùng có phải là thành viên của một nhóm hay không
router.get('/check/:userId/:groupId', groupMemberController.checkGroupMembership);

export default router; 