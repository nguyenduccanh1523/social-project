import express from 'express'
import * as postMediaController from '../../controllers/post/post-media.js'
import { verifyToken } from '../../middlewares/auth.js'

const router = express.Router()

router.get('/', verifyToken, postMediaController.getAllPostMedias)
router.get('/:id', verifyToken, postMediaController.getPostMediaById)
router.post('/', verifyToken, postMediaController.createPostMedia)
router.put('/:id', verifyToken, postMediaController.updatePostMedia)
router.delete('/:id', verifyToken, postMediaController.deletePostMedia)

export default router 