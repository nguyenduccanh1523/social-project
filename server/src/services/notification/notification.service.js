'use strict';
import db from '../../models';
import { Op } from 'sequelize';

// Tạo thông báo mới
export const createNotification = async (data) => {
  try {
    const { title, content, link, is_global = false, notice_type_id, creator } = data;
    
    // Kiểm tra notice_type_id có tồn tại không
    const noticeTypeExists = await db.NoticeType.findByPk(notice_type_id);
    if (!noticeTypeExists) {
      throw new Error('Loại thông báo không tồn tại');
    }
    
    // Tạo thông báo
    const notification = await db.Notification.create({
      title,
      content,
      link,
      is_global,
      notice_type_id
    });
    
    // Tạo thông tin người tạo thông báo
    if (creator) {
      const { user_id, page_id, group_id, event_id } = creator;
      await db.NotificationCreated.create({
        notification_id: notification.documentId,
        user_id: user_id || null,
        page_id: page_id || null,
        group_id: group_id || null,
        event_id: event_id || null
      });
    }
    
    // Lấy thông báo với các quan hệ
    return await getNotificationById(notification.documentId);
  } catch (error) {
    throw new Error(`Lỗi khi tạo thông báo: ${error.message}`);
  }
};

// Lấy danh sách thông báo
export const getAllNotifications = async ({
  notice_type_id,
  page = 1,
  limit = 10
}) => {
  try {
    let condition = {};
    if (notice_type_id) {
      condition.notice_type_id = notice_type_id;
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows: notifications } = await db.Notification.findAndCountAll({
      where: condition,
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
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    return {
      data: notifications,
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
    throw new Error(`Lỗi khi lấy danh sách thông báo: ${error.message}`);
  }
};

// Lấy thông báo theo ID
export const getNotificationById = async (id) => {
  try {
    const notification = await db.Notification.findByPk(id, {
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
    });
    
    if (!notification) {
      throw new Error('Thông báo không tồn tại');
    }
    
    return notification;
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông tin thông báo: ${error.message}`);
  }
};

// Cập nhật thông báo
export const updateNotification = async (id, data) => {
  try {
    const { title, content, link, is_global, is_read, notice_type_id } = data;
    
    const notification = await db.Notification.findByPk(id);
    if (!notification) {
      throw new Error('Thông báo không tồn tại');
    }
    
    // Nếu có notice_type_id, kiểm tra tồn tại không
    if (notice_type_id) {
      const noticeTypeExists = await db.NoticeType.findByPk(notice_type_id);
      if (!noticeTypeExists) {
        throw new Error('Loại thông báo không tồn tại');
      }
    }
    
    // Cập nhật thông báo
    await notification.update({
      title: title !== undefined ? title : notification.title,
      content: content !== undefined ? content : notification.content,
      link: link !== undefined ? link : notification.link,
      is_global: is_global !== undefined ? is_global : notification.is_global,
      is_read: is_read !== undefined ? is_read : notification.is_read,
      notice_type_id: notice_type_id || notification.notice_type_id
    });
    
    return await getNotificationById(id);
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật thông báo: ${error.message}`);
  }
};

// Xóa thông báo
export const deleteNotification = async (id) => {
  try {
    const notification = await db.Notification.findByPk(id);
    if (!notification) {
      throw new Error('Thông báo không tồn tại');
    }
    
    // Xóa thông báo
    await notification.destroy();
    
    return { message: 'Xóa thông báo thành công' };
  } catch (error) {
    throw new Error(`Lỗi khi xóa thông báo: ${error.message}`);
  }
}; 