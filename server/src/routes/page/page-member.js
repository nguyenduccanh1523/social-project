import express from 'express'
import * as pageMemberController from '../../controllers/page/page-member'
import { verifyToken } from '../../middlewares/auth'

const router = express.Router()

// Lấy tất cả thành viên của trang (có phân trang, lọc)
router.get('/', verifyToken, pageMemberController.getPageMembers)

// Lấy chi tiết thành viên
router.get('/:id', verifyToken, pageMemberController.getPageMember)

// Thêm thành viên mới vào trang
router.post('/', verifyToken, pageMemberController.addPageMember)

// Cập nhật vai trò của thành viên
router.put('/:userId/role', verifyToken, pageMemberController.updatePageMemberRole)

// Xóa thành viên khỏi trang
router.delete('/:pageId/members/:userId', verifyToken, pageMemberController.removePageMember)

// Kiểm tra người dùng có phải là thành viên của trang
router.get('/:pageId/check-member', verifyToken, pageMemberController.checkPageMember)

// Kiểm tra người dùng có phải là admin của trang
router.get('/:pageId/check-admin', verifyToken, pageMemberController.checkPageAdmin)

// Người dùng tự tham gia vào trang
router.post('/:pageId/join', verifyToken, pageMemberController.joinPage)

// Người dùng tự rời khỏi trang
router.post('/:pageId/leave', verifyToken, pageMemberController.leavePage)

export default router
