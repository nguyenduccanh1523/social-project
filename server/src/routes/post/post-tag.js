import express from 'express'
import * as postTagController from '../../controllers/post/post-tags'
import { verifyToken } from '../../middlewares/auth'

const router = express.Router()

// Lấy post-tags với các trường tùy chỉnh theo tagId
router.get('/by-tag/:tagId', verifyToken, postTagController.getCustomPostTagsByTagId)

// Lấy tất cả tags (có phân trang, lọc)
router.get('/', verifyToken, postTagController.getAllPostTags)

// Lấy tag theo ID
router.get('/:id', verifyToken, postTagController.getPostTagById)

// Tạo tag mới (yêu cầu đăng nhập)
router.post('/', verifyToken, postTagController.createPostTag)

// Cập nhật tag (yêu cầu đăng nhập)
router.put('/:id', verifyToken, postTagController.updatePostTag)

// Xóa tag (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, postTagController.deletePostTag)

export default router