'use strict';
import * as notificationCreatedService from '../../services/notification/notification-created.service.js';

export const createNotificationCreator = async (req, res) => {
  try {
    const { notification_id, user_id, page_id, group_id, event_id } = req.body;
    
    if (!notification_id) {
      return res.status(400).json({
        err: -1,
        message: 'Thiếu ID thông báo'
      });
    }
    
    // Phải có ít nhất một đối tượng tạo thông báo
    if (!user_id && !page_id && !group_id && !event_id) {
      return res.status(400).json({
        err: -1,
        message: 'Phải có ít nhất một đối tượng tạo thông báo'
      });
    }
    
    const creator = await notificationCreatedService.createNotificationCreator({
      notification_id,
      user_id,
      page_id,
      group_id,
      event_id
    });
    
    return res.status(201).json({
      err: 0,
      message: 'Tạo thông tin người tạo thông báo thành công',
      data: creator
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: 'Lỗi từ server: ' + error.message
    });
  }
};

export const getAllNotificationCreators = async (req, res) => {
  try {
    const { notification_id, user_id, page_id, group_id, event_id } = req.query;
    
    const creators = await notificationCreatedService.getAllNotificationCreators({
      notification_id,
      user_id,
      page_id,
      group_id,
      event_id
    });
    
    return res.status(200).json({
      err: 0,
      message: 'Lấy danh sách người tạo thông báo thành công',
      data: creators
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: 'Lỗi từ server: ' + error.message
    });
  }
};

export const getNotificationCreatorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const creator = await notificationCreatedService.getNotificationCreatorById(id);
    
    return res.status(200).json({
      err: 0,
      message: 'Lấy thông tin người tạo thông báo thành công',
      data: creator
    });
  } catch (error) {
    return res.status(404).json({
      err: -1,
      message: error.message
    });
  }
};

export const updateNotificationCreator = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, page_id, group_id, event_id } = req.body;
    
    const updatedCreator = await notificationCreatedService.updateNotificationCreator(id, {
      user_id,
      page_id,
      group_id,
      event_id
    });
    
    return res.status(200).json({
      err: 0,
      message: 'Cập nhật thông tin người tạo thông báo thành công',
      data: updatedCreator
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: 'Lỗi từ server: ' + error.message
    });
  }
};

export const deleteNotificationCreator = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await notificationCreatedService.deleteNotificationCreator(id);
    
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