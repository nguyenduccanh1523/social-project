import express from 'express'
import * as pageController from '../../controllers/page/page.js'
import { verifyToken } from '../../middlewares/auth.js'

const router = express.Router()

// Lấy tất cả trang (có phân trang, lọc)
router.get('/', verifyToken, pageController.getAllPages)

// Lấy trang theo ID
router.get('/:id', verifyToken, pageController.getPageById)

// Tạo trang mới (yêu cầu đăng nhập)
router.post('/', verifyToken, pageController.createPage)

// Cập nhật trang (yêu cầu đăng nhập)
router.put('/:id', verifyToken, pageController.updatePage)

// Xóa trang (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, pageController.deletePage)

// Routes cho page-members
// Lấy tất cả thành viên trang (có phân trang, lọc)
router.get('/page-members', verifyToken, pageController.getAllPageMembers)

// Lấy thành viên trang theo ID
router.get('/page-members/:id', verifyToken, pageController.getPageMemberById)

// Thêm thành viên trang mới (yêu cầu đăng nhập)
router.post('/page-members', verifyToken, pageController.createPageMember)

// Xóa thành viên trang (yêu cầu đăng nhập)
router.delete('/page-members/:id', verifyToken, pageController.deletePageMember)

// Routes cho page-open-hours
// Lấy tất cả giờ mở cửa của trang (có phân trang, lọc)
router.get('/page-open-hours', verifyToken, pageController.getAllPageOpenHours)

// Lấy giờ mở cửa trang theo ID
router.get('/page-open-hours/:id', verifyToken, pageController.getPageOpenHourById)

// Thêm giờ mở cửa trang mới (yêu cầu đăng nhập)
router.post('/page-open-hours', verifyToken, pageController.createPageOpenHour)

// Cập nhật giờ mở cửa trang (yêu cầu đăng nhập)
router.put('/page-open-hours/:id', verifyToken, pageController.updatePageOpenHour)

export default router