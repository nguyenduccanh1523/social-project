'use strict';
import * as notificationSettingService from '../../services/notification/notification-setting.service';

export const createNotificationSetting = async (req, res) => {
  try {
    const { user_id, group_id, notice_type_id, is_enabled } = req.body;
    
    if (!user_id || !notice_type_id) {
      return res.status(400).json({
        err: -1,
        message: 'Thiếu thông tin cần thiết'
      });
    }
    
    const setting = await notificationSettingService.create({
      user_id,
      group_id,
      notice_type_id,
      is_enabled
    });
    
    return res.status(201).json({
      err: 0,
      message: 'Tạo/cập nhật cài đặt thông báo thành công',
      data: setting
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: 'Lỗi từ server: ' + error.message
    });
  }
};

export const findAllNotificationSettings = async (req, res) => {
  try {
    const { user_id, group_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({
        err: -1,
        message: 'Thiếu ID người dùng'
      });
    }
    
    const settings = await notificationSettingService.findAll({
      user_id,
      group_id
    });
    
    return res.status(200).json({
      err: 0,
      message: 'Lấy danh sách cài đặt thông báo thành công',
      data: settings
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: 'Lỗi từ server: ' + error.message
    });
  }
};

export const updateNotificationSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_enabled } = req.body;
    
    if (is_enabled === undefined) {
      return res.status(400).json({
        err: -1,
        message: 'Thiếu thông tin cần thiết'
      });
    }
    
    const updatedSetting = await notificationSettingService.update(id, { is_enabled });
    
    return res.status(200).json({
      err: 0,
      message: 'Cập nhật cài đặt thông báo thành công',
      data: updatedSetting
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: 'Lỗi từ server: ' + error.message
    });
  }
};

export const deleteNotificationSetting = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await notificationSettingService.deleteNotificationSetting(id);
    
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
