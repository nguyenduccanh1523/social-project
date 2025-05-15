import express from 'express'
import * as userSocialController from '../controllers/user-social.js'
import { verifyToken } from '../middlewares/auth.js'

const router = express.Router()

// Lấy tất cả user-socials (có phân trang, lọc)
router.get('/', verifyToken, userSocialController.getAllUserSocials)

// Lấy user-social theo ID
router.get('/:id', verifyToken, userSocialController.getUserSocialById)

// Tạo user-social mới (yêu cầu đăng nhập)
router.post('/', verifyToken, userSocialController.createUserSocial)

// Cập nhật user-social (yêu cầu đăng nhập)
router.put('/:id', verifyToken, userSocialController.updateUserSocial)

// Xóa user-social (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, userSocialController.deleteUserSocial)

export default router