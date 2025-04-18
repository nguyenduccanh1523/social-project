import express from 'express'
import * as groupController from '../../controllers/group/group'
import { verifyToken } from '../../middlewares/auth'

const router = express.Router()

// Lấy tất cả nhóm (có phân trang, lọc)
router.get('/', verifyToken, groupController.getAllGroups)

// Lấy nhóm theo ID
router.get('/:id', verifyToken, groupController.getGroupById)

// Tạo nhóm mới (yêu cầu đăng nhập)
router.post('/', verifyToken, groupController.createGroup)

// Cập nhật nhóm (yêu cầu đăng nhập)
router.put('/:id', verifyToken, groupController.updateGroup)

// Xóa nhóm (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, groupController.deleteGroup)

// Lấy danh sách nhóm mà user là thành viên
router.get('/user/:userId', verifyToken, groupController.getGroupsByUserId)

// Lấy danh sách nhóm mà user là admin
router.get('/admin/:userId', verifyToken, groupController.getGroupsAdminByUserId)

export default router
