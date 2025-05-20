import express from 'express'
import * as postFriendController from '../../controllers/post/post-friend.js'
import { verifyToken } from '../../middlewares/auth.js'

const router = express.Router()

router.get('/', verifyToken, postFriendController.getAllPostFriends)
router.get('/:id', verifyToken, postFriendController.getPostFriendById)
router.post('/', verifyToken, postFriendController.createPostFriend)
router.put('/:id', verifyToken, postFriendController.updatePostFriend)
router.delete('/:id', verifyToken, postFriendController.deletePostFriend)

export default router 