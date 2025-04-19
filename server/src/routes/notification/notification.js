'use strict';
const express = require('express');
const router = express.Router();
const { createNotification, getAllNotifications, getNotificationById, updateNotification, deleteNotification } = require('../../controllers/notification/notification');
const { verifyToken } = require('../../middlewares/auth');

router.post('/', verifyToken, createNotification);

router.get('/', verifyToken, getAllNotifications);

router.get('/:id', verifyToken, getNotificationById);

router.put('/:id', verifyToken, updateNotification);

router.delete('/:id', verifyToken, deleteNotification);

module.exports = router; 