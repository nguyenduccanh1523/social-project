'use strict';
import express from 'express'; 
const router = express.Router();
import * as notificationController from '../../controllers/notification/notification.js';
import { verifyToken } from '../../middlewares/auth.js'

router.post('/', verifyToken, notificationController.createNotification);

router.get('/', verifyToken, notificationController.getAllNotifications);

router.get('/:id', verifyToken, notificationController.getNotificationById);

router.put('/:id', verifyToken, notificationController.updateNotification);

router.delete('/:id', verifyToken, notificationController.deleteNotification);

export default router