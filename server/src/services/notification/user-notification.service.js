'use strict';
import db from '../../models/index.js';
import { Op } from 'sequelize';

// Tạo thông báo cho người dùng
export const createUserNotification = async (data) => {
  try {
    const { user_id, notification_id, is_read = false } = data;
    
    // Kiểm tra user_id có tồn tại không
    const userExists = await db.User.findByPk(user_id);
    if (!userExists) {
      throw new Error('Người dùng không tồn tại');
    }
    
    // Kiểm tra notification_id có tồn tại không
    const notificationExists = await db.Notification.findByPk(notification_id);
    if (!notificationExists) {
      throw new Error('Thông báo không tồn tại');
    }
    
    // Kiểm tra thông báo đã được gắn cho người dùng chưa
    const userNotificationExists = await db.UserNotification.findOne({
      where: {
        user_id,
        notification_id
      }
    });
    
    if (userNotificationExists) {
      throw new Error('Thông báo đã được gắn cho người dùng này');
    }
    
    // Tạo thông báo cho người dùng
    const userNotification = await db.UserNotification.create({
      user_id,
      notification_id,
      is_read,
      read_at: is_read ? new Date() : null
    });
    
    return await getUserNotificationById(userNotification.documentId);
  } catch (error) {
    throw new Error(`Lỗi khi tạo thông báo cho người dùng: ${error.message}`);
  }
};

// Lấy danh sách thông báo của người dùng
export const getAllUserNotifications = async ({
  user_id,
  notification_id,
  is_read,
  page = 1,
  limit = 10
}) => {
  try {
    let condition = {};
    
    if (user_id) {
      condition.user_id = user_id;
    }
    
    if (notification_id) {
      condition.notification_id = notification_id;
    }
    
    if (is_read !== undefined) {
      condition.is_read = is_read === 'true';
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows: userNotifications } = await db.UserNotification.findAndCountAll({
      where: condition,
      include: [
        {
          model: db.Notification,
          as: 'notification',
          include: [
            {
              model: db.NoticeType,
              as: 'noticeType'
            },
            {
              model: db.NotificationCreated,
              as: 'creators',
              include: [
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
            }
          ]
        },
        {
          model: db.User,
          as: 'user',
          attributes: ['documentId', 'firstName', 'lastName', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    return {
      data: userNotifications,
      meta: {
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(limit),
          pageCount: Math.ceil(count / limit),
          total: count
        }
      }
    };
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách thông báo của người dùng: ${error.message}`);
  }
};

// Lấy thông báo của người dùng theo ID
export const getUserNotificationById = async (id) => {
  try {
    const userNotification = await db.UserNotification.findByPk(id, {
      include: [
        {
          model: db.Notification,
          as: 'notification',
          include: [
            {
              model: db.NoticeType,
              as: 'noticeType'
            },
            {
              model: db.NotificationCreated,
              as: 'creators',
              include: [
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
            }
          ]
        },
        {
          model: db.User,
          as: 'user',
          attributes: ['documentId', 'firstName', 'lastName', 'avatar']
        }
      ]
    });
    
    if (!userNotification) {
      throw new Error('Thông báo của người dùng không tồn tại');
    }
    
    return userNotification;
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông tin thông báo của người dùng: ${error.message}`);
  }
};

// Đánh dấu thông báo là đã đọc
export const markAsRead = async (id) => {
  try {
    const userNotification = await db.UserNotification.findByPk(id);
    if (!userNotification) {
      throw new Error('Thông báo của người dùng không tồn tại');
    }
    
    if (userNotification.is_read) {
      throw new Error('Thông báo đã được đánh dấu là đã đọc');
    }
    
    // Đánh dấu thông báo là đã đọc
    await userNotification.update({
      is_read: true,
      read_at: new Date()
    });
    
    return await getUserNotificationById(id);
  } catch (error) {
    throw new Error(`Lỗi khi đánh dấu thông báo là đã đọc: ${error.message}`);
  }
};

// Đánh dấu tất cả thông báo là đã đọc
export const markAllAsRead = async (user_id) => {
  try {
    // Kiểm tra user_id có tồn tại không
    const userExists = await db.User.findByPk(user_id);
    if (!userExists) {
      throw new Error('Người dùng không tồn tại');
    }
    
    // Đánh dấu tất cả thông báo của người dùng là đã đọc
    await db.UserNotification.update(
      {
        is_read: true,
        read_at: new Date()
      },
      {
        where: {
          user_id,
          is_read: false
        }
      }
    );
    
    return { message: 'Đánh dấu tất cả thông báo là đã đọc thành công' };
  } catch (error) {
    throw new Error(`Lỗi khi đánh dấu tất cả thông báo là đã đọc: ${error.message}`);
  }
};

// Xóa thông báo của người dùng
export const deleteUserNotification = async (id) => {
  try {
    const userNotification = await db.UserNotification.findByPk(id);
    if (!userNotification) {
      throw new Error('Thông báo của người dùng không tồn tại');
    }
    
    // Xóa thông báo của người dùng
    await userNotification.destroy();
    
    return { message: 'Xóa thông báo của người dùng thành công' };
  } catch (error) {
    throw new Error(`Lỗi khi xóa thông báo của người dùng: ${error.message}`);
  }
};

// Xóa tất cả thông báo của người dùng
export const deleteAllByUser = async (user_id) => {
  try {
    // Kiểm tra user_id có tồn tại không
    const userExists = await db.User.findByPk(user_id);
    if (!userExists) {
      throw new Error('Người dùng không tồn tại');
    }
    
    // Xóa tất cả thông báo của người dùng
    await db.UserNotification.destroy({
      where: {
        user_id
      }
    });
    
    return { message: 'Xóa tất cả thông báo của người dùng thành công' };
  } catch (error) {
    throw new Error(`Lỗi khi xóa tất cả thông báo của người dùng: ${error.message}`);
  }
}; 