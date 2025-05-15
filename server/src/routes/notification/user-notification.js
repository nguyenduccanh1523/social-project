'use strict';
import express from 'express'; 
const router = express.Router();
import * as userNotificationController from '../../controllers/notification/user-notification.js';
import { verifyToken } from '../../middlewares/auth.js'

router.post('/', verifyToken, userNotificationController.createUserNotification);

router.get('/', verifyToken, userNotificationController.getAllUserNotifications);

router.get('/:id', verifyToken, userNotificationController.getUserNotificationById);

router.put('/:id/mark-as-read', verifyToken, userNotificationController.markAsRead);

router.put('/mark-all-as-read', verifyToken, userNotificationController.markAllAsRead);

router.delete('/:id', verifyToken, userNotificationController.deleteUserNotification);

router.delete('/user/:user_id', verifyToken, userNotificationController.deleteAllByUser);

export default router