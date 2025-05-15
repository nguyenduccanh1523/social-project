import express from 'express'
import * as nationController from '../controllers/nation.js'
import { verifyToken, isAdmin } from '../middlewares/auth.js'

const router = express.Router()

// Route công khai - không cần xác thực
router.get('/', verifyToken, nationController.getAllNations)
router.get('/:id', verifyToken, nationController.getNationById)


// Tạo quốc gia mới (yêu cầu đăng nhập)
router.post('/', verifyToken, nationController.createNation)

// Cập nhật quốc gia (yêu cầu đăng nhập)
router.put('/:id', verifyToken, isAdmin, nationController.updateNation)

// Xóa quốc gia (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, isAdmin, nationController.deleteNation)

export default router