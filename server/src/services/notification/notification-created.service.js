'use strict';
import db from '../../models';
import { Op } from 'sequelize';

// Tạo thông tin người tạo thông báo
export const createNotificationCreator = async (data) => {
  try {
    const { notification_id, user_id, page_id, group_id, event_id } = data;
    
    // Kiểm tra notification_id có tồn tại không
    const notificationExists = await db.Notification.findByPk(notification_id);
    if (!notificationExists) {
      throw new Error('Thông báo không tồn tại');
    }
    
    // Kiểm tra các đối tượng tạo thông báo tồn tại không
    if (user_id) {
      const userExists = await db.User.findByPk(user_id);
      if (!userExists) {
        throw new Error('Người dùng không tồn tại');
      }
    }
    
    if (page_id) {
      const pageExists = await db.Page.findByPk(page_id);
      if (!pageExists) {
        throw new Error('Trang không tồn tại');
      }
    }
    
    if (group_id) {
      const groupExists = await db.Group.findByPk(group_id);
      if (!groupExists) {
        throw new Error('Nhóm không tồn tại');
      }
    }
    
    if (event_id) {
      const eventExists = await db.Event.findByPk(event_id);
      if (!eventExists) {
        throw new Error('Sự kiện không tồn tại');
      }
    }
    
    // Tạo thông tin người tạo thông báo
    const notificationCreated = await db.NotificationCreated.create({
      notification_id,
      user_id: user_id || null,
      page_id: page_id || null,
      group_id: group_id || null,
      event_id: event_id || null
    });
    
    return await getNotificationCreatorById(notificationCreated.documentId);
  } catch (error) {
    throw new Error(`Lỗi khi tạo thông tin người tạo thông báo: ${error.message}`);
  }
};

// Lấy danh sách người tạo thông báo
export const getAllNotificationCreators = async (query) => {
  try {
    const { notification_id, user_id, page_id, group_id, event_id } = query;
    
    let condition = {};
    
    if (notification_id) {
      condition.notification_id = notification_id;
    }
    
    if (user_id) {
      condition.user_id = user_id;
    }
    
    if (page_id) {
      condition.page_id = page_id;
    }
    
    if (group_id) {
      condition.group_id = group_id;
    }
    
    if (event_id) {
      condition.event_id = event_id;
    }
    
    const creators = await db.NotificationCreated.findAll({
      where: condition,
      include: [
        {
          model: db.Notification,
          as: 'notification',
          include: [
            {
              model: db.NoticeType,
              as: 'noticeType'
            }
          ]
        },
        {
          model: db.User,
          as: 'user',
          attributes: ['documentId', 'firstName', 'lastName', 'avatar']
        },
        {
          model: db.Page,
          as: 'page',
          attributes: ['documentId', 'name', 'avatar']
        },
        {
          model: db.Group,
          as: 'group',
          attributes: ['documentId', 'name', 'avatar']
        },
        {
          model: db.Event,
          as: 'event',
          attributes: ['documentId', 'name', 'image']
        }
      ]
    });
    
    return creators;
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách người tạo thông báo: ${error.message}`);
  }
};

// Lấy thông tin người tạo thông báo theo ID
export const getNotificationCreatorById = async (id) => {
  try {
    const creator = await db.NotificationCreated.findByPk(id, {
      include: [
        {
          model: db.Notification,
          as: 'notification',
          include: [
            {
              model: db.NoticeType,
              as: 'noticeType'
            }
          ]
        },
        {
          model: db.User,
          as: 'user',
          attributes: ['documentId', 'firstName', 'lastName', 'avatar']
        },
        {
          model: db.Page,
          as: 'page',
          attributes: ['documentId', 'name', 'avatar']
        },
        {
          model: db.Group,
          as: 'group',
          attributes: ['documentId', 'name', 'avatar']
        },
        {
          model: db.Event,
          as: 'event',
          attributes: ['documentId', 'name', 'image']
        }
      ]
    });
    
    if (!creator) {
      throw new Error('Thông tin người tạo thông báo không tồn tại');
    }
    
    return creator;
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông tin người tạo thông báo: ${error.message}`);
  }
};

// Cập nhật thông tin người tạo thông báo
export const updateNotificationCreator = async (id, data) => {
  try {
    const { user_id, page_id, group_id, event_id } = data;
    
    const creator = await db.NotificationCreated.findByPk(id);
    if (!creator) {
      throw new Error('Thông tin người tạo thông báo không tồn tại');
    }
    
    // Kiểm tra các đối tượng tạo thông báo tồn tại không
    if (user_id) {
      const userExists = await db.User.findByPk(user_id);
      if (!userExists) {
        throw new Error('Người dùng không tồn tại');
      }
    }
    
    if (page_id) {
      const pageExists = await db.Page.findByPk(page_id);
      if (!pageExists) {
        throw new Error('Trang không tồn tại');
      }
    }
    
    if (group_id) {
      const groupExists = await db.Group.findByPk(group_id);
      if (!groupExists) {
        throw new Error('Nhóm không tồn tại');
      }
    }
    
    if (event_id) {
      const eventExists = await db.Event.findByPk(event_id);
      if (!eventExists) {
        throw new Error('Sự kiện không tồn tại');
      }
    }
    
    // Cập nhật thông tin người tạo thông báo
    await creator.update({
      user_id: user_id !== undefined ? user_id : creator.user_id,
      page_id: page_id !== undefined ? page_id : creator.page_id,
      group_id: group_id !== undefined ? group_id : creator.group_id,
      event_id: event_id !== undefined ? event_id : creator.event_id
    });
    
    return await getNotificationCreatorById(id);
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật thông tin người tạo thông báo: ${error.message}`);
  }
};

// Xóa thông tin người tạo thông báo
export const deleteNotificationCreator = async (id) => {
  try {
    const creator = await db.NotificationCreated.findByPk(id);
    if (!creator) {
      throw new Error('Thông tin người tạo thông báo không tồn tại');
    }
    
    // Xóa thông tin người tạo thông báo
    await creator.destroy();
    
    return { message: 'Xóa thông tin người tạo thông báo thành công' };
  } catch (error) {
    throw new Error(`Lỗi khi xóa thông tin người tạo thông báo: ${error.message}`);
  }
}; 