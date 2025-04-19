'use strict';
import db from '../../models';
import { Op } from 'sequelize';

// Tạo hoặc cập nhật cài đặt thông báo
export const create = async (data) => {
  try {
    const { user_id, group_id, notice_type_id, is_enabled = true } = data;
    
    // Kiểm tra xem người dùng tồn tại không
    const userExists = await db.User.findByPk(user_id);
    if (!userExists) {
      throw new Error('Người dùng không tồn tại');
    }
    
    // Kiểm tra loại thông báo tồn tại không
    const noticeTypeExists = await db.NoticeType.findByPk(notice_type_id);
    if (!noticeTypeExists) {
      throw new Error('Loại thông báo không tồn tại');
    }
    
    // Nếu có group_id, kiểm tra nhóm tồn tại không
    if (group_id) {
      const groupExists = await db.Group.findByPk(group_id);
      if (!groupExists) {
        throw new Error('Nhóm không tồn tại');
      }
    }
    
    // Tìm kiếm cài đặt thông báo đã tồn tại chưa
    let condition = { user_id, notice_type_id };
    if (group_id) {
      condition.group_id = group_id;
    } else {
      condition.group_id = null;
    }
    
    // Tìm hoặc tạo cài đặt thông báo
    const [setting, created] = await db.NotificationSetting.findOrCreate({
      where: condition,
      defaults: {
        is_enabled,
        user_id,
        notice_type_id,
        group_id: group_id || null
      }
    });
    
    // Nếu không phải mới tạo, cập nhật cài đặt
    if (!created) {
      await setting.update({ is_enabled });
    }
    
    return setting;
  } catch (error) {
    throw new Error(`Lỗi khi tạo/cập nhật cài đặt thông báo: ${error.message}`);
  }
};

// Lấy danh sách cài đặt thông báo
export const findAll = async (query) => {
  try {
    const { user_id, group_id } = query;
    
    if (!user_id) {
      throw new Error('Thiếu ID người dùng');
    }
    
    // Tạo điều kiện tìm kiếm
    let condition = { user_id };
    if (group_id) {
      condition.group_id = group_id;
    }
    
    const settings = await db.NotificationSetting.findAll({
      where: condition,
      include: [
        {
          model: db.NoticeType,
          as: 'noticeType'
        },
        {
          model: db.Group,
          as: 'group',
          attributes: ['documentId', 'group_name', 'description', 'group_image']
        }
      ]
    });
    
    return settings;
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách cài đặt thông báo: ${error.message}`);
  }
};

// Cập nhật cài đặt thông báo
export const update = async (id, data) => {
  try {
    const { is_enabled } = data;
    
    const setting = await db.NotificationSetting.findByPk(id);
    if (!setting) {
      throw new Error('Cài đặt thông báo không tồn tại');
    }
    
    await setting.update({ is_enabled });
    
    return await db.NotificationSetting.findByPk(id, {
      include: [
        {
          model: db.NoticeType,
          as: 'noticeType'
        },
        {
          model: db.Group,
          as: 'group',
          attributes: ['documentId', 'group_name', 'description', 'group_image']
        }
      ]
    });
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật cài đặt thông báo: ${error.message}`);
  }
};

// Xóa cài đặt thông báo
export const deleteNotificationSetting = async (id) => {
  try {
    const setting = await db.NotificationSetting.findByPk(id);
    if (!setting) {
      throw new Error('Cài đặt thông báo không tồn tại');
    }
    
    await setting.destroy();
    
    return { message: 'Xóa cài đặt thông báo thành công' };
  } catch (error) {
    throw new Error(`Lỗi khi xóa cài đặt thông báo: ${error.message}`);
  }
};
