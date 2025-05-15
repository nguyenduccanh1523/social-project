import express from 'express'
import * as storyController from '../controllers/story.js'
import { verifyToken } from '../middlewares/auth.js'

const router = express.Router()

// Lấy tất cả stories (có phân trang, lọc)
router.get('/', storyController.getAllStories)

// Lấy story theo ID
router.get('/:id', storyController.getStoryById)

// Tạo story mới (yêu cầu đăng nhập)
router.post('/', verifyToken, storyController.createStory)

// Cập nhật story (yêu cầu đăng nhập)
router.put('/:id', verifyToken, storyController.updateStory)

// Xóa story (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, storyController.deleteStory)

// Đánh dấu story đã xem (yêu cầu đăng nhập)
router.post('/:id/view', verifyToken, storyController.viewStory)

// Lấy danh sách người xem story
router.get('/:id/viewers', verifyToken, storyController.getStoryViewers)

export default router