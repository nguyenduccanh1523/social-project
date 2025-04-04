import express from 'express'
import * as roleController from '../controllers/role'
import { verifyToken, isAdmin } from '../middlewares/auth'

const router = express.Router()

// Lấy tất cả vai trò (có phân trang)
router.get('/', verifyToken, roleController.getAllRoles)

// Lấy vai trò theo ID
router.get('/:id', verifyToken, roleController.getRoleById)

// Tạo vai trò mới (chỉ admin)
router.post('/', verifyToken, isAdmin, roleController.createRole)

// Cập nhật vai trò (chỉ admin)
router.put('/:id', verifyToken, isAdmin, roleController.updateRole)

// Xóa vai trò (chỉ admin)
router.delete('/:id', verifyToken, isAdmin, roleController.deleteRole)

export default router 