import express from 'express'
import * as documentShareController from '../../controllers/document/document-share.js'
import { verifyToken } from '../../middlewares/auth.js'

const router = express.Router()

// Lấy tất cả document shares (có phân trang, lọc)
router.get('/', verifyToken, documentShareController.getAllDocumentShares)

// Lấy document share theo ID
router.get('/:id', verifyToken, documentShareController.getDocumentShareById)

// Tạo document share mới (yêu cầu đăng nhập)
router.post('/', verifyToken, documentShareController.createDocumentShare)

// Cập nhật document share (yêu cầu đăng nhập)
router.put('/:id', verifyToken, documentShareController.updateDocumentShare)

// Xóa document share (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, documentShareController.deleteDocumentShare)

export default router