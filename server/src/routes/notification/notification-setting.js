'use strict';
const express = require('express');
const router = express.Router();
const { createNotificationSetting, findAllNotificationSettings, updateNotificationSetting, deleteNotificationSetting } = require('../../controllers/notification/notification-setting');
const { verifyToken } = require('../../middlewares/auth');

router.post('/', verifyToken, createNotificationSetting);

router.get('/', verifyToken, findAllNotificationSettings);

router.put('/:id', verifyToken, updateNotificationSetting);

router.delete('/:id', verifyToken, deleteNotificationSetting);

module.exports = router;
