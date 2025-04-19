'use strict';
const express = require('express');
const router = express.Router();
const { createUserNotification, getAllUserNotifications, getUserNotificationById, markAsRead, markAllAsRead, deleteUserNotification, deleteAllByUser } = require('../../controllers/notification/user-notification');
const { verifyToken } = require('../../middlewares/auth');

router.post('/', verifyToken, createUserNotification);

router.get('/', verifyToken, getAllUserNotifications);

router.get('/:id', verifyToken, getUserNotificationById);

router.put('/:id/mark-as-read', verifyToken, markAsRead);

router.put('/mark-all-as-read', verifyToken, markAllAsRead);

router.delete('/:id', verifyToken, deleteUserNotification);

router.delete('/user/:user_id', verifyToken, deleteAllByUser);

module.exports = router; 