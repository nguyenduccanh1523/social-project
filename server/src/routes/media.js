import express from 'express'
import * as mediaController from '../controllers/media.js'
import { verifyToken } from '../middlewares/auth.js'

const router = express.Router()

// ===== MEDIA Routes =====
// Lấy tất cả media (có phân trang, lọc)
router.get('/', verifyToken, mediaController.getAllMedias)

// ===== POST-MEDIA Routes =====
// Lấy tất cả post-media (có phân trang, lọc)
router.get('/post-medias/', verifyToken, mediaController.getAllPostMedias)

// Lấy post-media theo ID
router.get('/post-medias/:id', verifyToken, mediaController.getPostMediaById)

// Lấy media theo ID
router.get('/:id', verifyToken, mediaController.getMediaById)

// Tạo media mới (yêu cầu đăng nhập)
router.post('/', verifyToken, mediaController.createMedia)

// Cập nhật media (yêu cầu đăng nhập)
router.put('/:id', verifyToken, mediaController.updateMedia)

// Xóa media (soft delete - yêu cầu đăng nhập)
router.delete('/:id', verifyToken, mediaController.deleteMedia)

// Khôi phục media đã xóa (yêu cầu đăng nhập)
router.put('/restore/:id', verifyToken, mediaController.restoreMedia)

// Tạo post-media mới (yêu cầu đăng nhập)
router.post('/post-medias/', verifyToken, mediaController.createPostMedia)

// Cập nhật post-media (yêu cầu đăng nhập)
router.put('/post-medias/:id', verifyToken, mediaController.updatePostMedia)

// Xóa post-media (yêu cầu đăng nhập)
router.delete('/post-medias/:id', verifyToken, mediaController.deletePostMedia)

export default router