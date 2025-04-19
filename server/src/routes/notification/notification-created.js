'use strict';
const express = require('express');
const router = express.Router();
const { createNotificationCreator, getAllNotificationCreators, getNotificationCreatorById, updateNotificationCreator, deleteNotificationCreator } = require('../../controllers/notification/notification-created');
const { verifyToken } = require('../../middlewares/auth');

router.post('/', verifyToken, createNotificationCreator);

router.get('/', verifyToken, getAllNotificationCreators);

router.get('/:id', verifyToken, getNotificationCreatorById);

router.put('/:id', verifyToken, updateNotificationCreator);

router.delete('/:id', verifyToken, deleteNotificationCreator);

module.exports = router; 