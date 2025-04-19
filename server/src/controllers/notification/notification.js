'use strict';
import * as notificationService from '../../services/notification/notification.service';

export const createNotification = async (req, res) => {
  try {
    const { title, content, link, is_global, notice_type_id, user_id, page_id, group_id, event_id } = req.body;
    
    if (!title || !content || !link || !notice_type_id) {
      return res.status(400).json({
        err: -1,
        message: 'Thiếu thông tin cần thiết'
      });
    }
    
    // Tạo object creator từ các id
    const creator = {};
    if (user_id) creator.user_id = user_id;
    if (page_id) creator.page_id = page_id;
    if (group_id) creator.group_id = group_id;
    if (event_id) creator.event_id = event_id;
    
    const notification = await notificationService.createNotification({
      title,
      content,
      link,
      is_global,
      notice_type_id,
      creator: Object.keys(creator).length > 0 ? creator : null
    });
    
    return res.status(201).json({
      err: 0,
      message: 'Tạo thông báo thành công',
      data: notification
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: 'Lỗi từ server: ' + error.message
    });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const { notice_type_id, page, limit } = req.query;
    
    const notificationsData = await notificationService.getAllNotifications({
      notice_type_id,
      page,
      limit
    });
    
    return res.status(200).json({
      err: 0,
      message: 'Lấy danh sách thông báo thành công',
      ...notificationsData
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: 'Lỗi từ server: ' + error.message
    });
  }
};

export const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await notificationService.getNotificationById(id);
    
    return res.status(200).json({
      err: 0,
      message: 'Lấy thông tin thông báo thành công',
      data: notification
    });
  } catch (error) {
    return res.status(404).json({
      err: -1,
      message: error.message
    });
  }
};

export const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, link, is_global, is_read, notice_type_id } = req.body;
    
    const updatedNotification = await notificationService.updateNotification(id, {
      title,
      content,
      link,
      is_global,
      is_read,
      notice_type_id
    });
    
    return res.status(200).json({
      err: 0,
      message: 'Cập nhật thông báo thành công',
      data: updatedNotification
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: 'Lỗi từ server: ' + error.message
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await notificationService.deleteNotification(id);
    
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