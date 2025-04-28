import express from 'express'
import * as authController from '../controllers/auth'
import { verifyToken } from '../middlewares/auth'

const router = express.Router()

router.post('/refresh', authController.refreshToken)
router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', verifyToken, authController.logout)

export default router