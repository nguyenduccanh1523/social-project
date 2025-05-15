import express from 'express'
import * as cmtDocumentController from '../../controllers/document/cmt-document.js'
import { verifyToken } from '../../middlewares/auth.js'

const router = express.Router()

// Lấy tất cả tags (có phân trang, lọc)
router.get('/', verifyToken, cmtDocumentController.getAllCmtDocument)

// Lấy tag theo ID
router.get('/:id', verifyToken, cmtDocumentController.getCmtDocumentById)

// Tạo tag mới (yêu cầu đăng nhập)
router.post('/', verifyToken, cmtDocumentController.createCmtDocument)

// Cập nhật tag (yêu cầu đăng nhập)
router.put('/:id', verifyToken, cmtDocumentController.updateCmtDocument)

// Xóa tag (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, cmtDocumentController.deleteCmtDocument)

export default router