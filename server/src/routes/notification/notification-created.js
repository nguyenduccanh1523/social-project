'use strict';
import express from 'express'; 
const router = express.Router();
import * as notificationCreatorController from '../../controllers/notification/notification-created.js';
import { verifyToken } from '../../middlewares/auth.js'

router.post('/', verifyToken, notificationCreatorController.createNotificationCreator);

router.get('/', verifyToken, notificationCreatorController.getAllNotificationCreators);

router.get('/:id', verifyToken, notificationCreatorController.getNotificationCreatorById);

router.put('/:id', verifyToken, notificationCreatorController.updateNotificationCreator);

router.delete('/:id', verifyToken, notificationCreatorController.deleteNotificationCreator);

export default router