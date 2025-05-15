'use strict';
import * as userNotificationService from '../../services/notification/user-notification.service.js';

export const createUserNotification = async (req, res) => {
  try {
    const { user_id, notification_id, is_read } = req.body;
    
    if (!user_id || !notification_id) {
      return res.status(400).json({
        err: -1,
        message: 'Thiếu thông tin cần thiết'
      });
    }
    
    const userNotification = await userNotificationService.createUserNotification({
      user_id,
      notification_id,
      is_read
    });
    
    return res.status(201).json({
      err: 0,
      message: 'Tạo thông báo cho người dùng thành công',
      data: userNotification
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: 'Lỗi từ server: ' + error.message
    });
  }
};

export const getAllUserNotifications = async (req, res) => {
  try {
    const { user_id, notification_id, is_read, page, limit } = req.query;
    
    const userNotificationsData = await userNotificationService.getAllUserNotifications({
      user_id,
      notification_id,
      is_read,
      page,
      limit
    });
    
    return res.status(200).json({
      err: 0,
      message: 'Lấy danh sách thông báo của người dùng thành công',
      ...userNotificationsData
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: 'Lỗi từ server: ' + error.message
    });
  }
};

export const getUserNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const userNotification = await userNotificationService.getUserNotificationById(id);
    
    return res.status(200).json({
      err: 0,
      message: 'Lấy thông tin thông báo của người dùng thành công',
      data: userNotification
    });
  } catch (error) {
    return res.status(404).json({
      err: -1,
      message: error.message
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const userNotification = await userNotificationService.markAsRead(id);
    
    return res.status(200).json({
      err: 0,
      message: 'Đánh dấu thông báo là đã đọc thành công',
      data: userNotification
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: 'Lỗi từ server: ' + error.message
    });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const { user_id } = req.body;
    
    if (!user_id) {
      return res.status(400).json({
        err: -1,
        message: 'Thiếu ID người dùng'
      });
    }
    
    const result = await userNotificationService.markAllAsRead(user_id);
    
    return res.status(200).json({
      err: 0,
      message: result.message
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: 'Lỗi từ server: ' + error.message
    });
  }
};

export const deleteUserNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await userNotificationService.deleteUserNotification(id);
    
    return res.status(200).json({
      err: 0,
      message: result.message
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: 'Lỗi từ server: ' + error.message
    });
  }
};

export const deleteAllByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    if (!user_id) {
      return res.status(400).json({
        err: -1,
        message: 'Thiếu ID người dùng'
      });
    }
    
    const result = await userNotificationService.deleteAllByUser(user_id);
    
    return res.status(200).json({
      err: 0,
      message: result.message
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: 'Lỗi từ server: ' + error.message
    });
  }
}; 