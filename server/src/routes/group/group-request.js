import express from 'express';
import * as groupRequestController from '../../controllers/group/group-request';
import { verifyToken } from '../../middlewares/auth';

const router = express.Router();

// Lấy tất cả yêu cầu tham gia nhóm (có phân trang, lọc)
router.get('/', verifyToken, groupRequestController.getAllGroupRequests);

// Lấy yêu cầu tham gia nhóm theo ID
router.get('/:id', verifyToken, groupRequestController.getGroupRequestById);

// Tạo yêu cầu tham gia nhóm (yêu cầu đăng nhập)
router.post('/', verifyToken, groupRequestController.createGroupRequest);

// Phản hồi yêu cầu tham gia nhóm (yêu cầu đăng nhập)
router.put('/:id/respond', verifyToken, groupRequestController.respondToRequest);

// Hủy yêu cầu tham gia nhóm (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, groupRequestController.cancelRequest);

// Lấy danh sách yêu cầu tham gia một nhóm (yêu cầu đăng nhập)
router.get('/group/:groupId', verifyToken, groupRequestController.getRequestsByGroupId);

// Lấy danh sách yêu cầu tham gia nhóm của một người dùng (yêu cầu đăng nhập)
router.get('/user/:userId', verifyToken, groupRequestController.getRequestsByUserId);

// Lấy số lượng yêu cầu đang chờ xử lý của một nhóm (yêu cầu đăng nhập)
router.get('/group/:groupId/pending-count', verifyToken, groupRequestController.getPendingRequestCount);

export default router;
