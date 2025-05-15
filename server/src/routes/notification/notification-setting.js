'use strict';
import express from 'express'; 
const router = express.Router();
import * as notificationSettingController from '../../controllers/notification/notification-setting.js';
import { verifyToken } from '../../middlewares/auth.js'

router.post('/', verifyToken, notificationSettingController.createNotificationSetting);

router.get('/', verifyToken, notificationSettingController.findAllNotificationSettings);

router.put('/:id', verifyToken, notificationSettingController.updateNotificationSetting);

router.delete('/:id', verifyToken, notificationSettingController.deleteNotificationSetting);

export default router