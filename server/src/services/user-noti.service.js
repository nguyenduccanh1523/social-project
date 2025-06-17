import db from '../models/index.js';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

// Lấy tất cả thông báo của người dùng có phân trang và lọc
export const getAllUserNotifications = async ({
    page = 1,
    pageSize = 10,
    filters = {},
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
    userId = null,
    notificationId = null
}) => {
    try {

        const offset = (page - 1) * pageSize;
        const whereConditions = {};

        // Áp dụng các bộ lọc nếu có
        if (filters.is_read !== undefined) {
            whereConditions.is_read = filters.is_read;
        }

        // Lọc theo userId nếu được cung cấp
        if (userId) {
            whereConditions.user_id = userId;
        }

        // Lọc theo notificationId nếu được cung cấp
        if (notificationId) {
            whereConditions.notification_id = notificationId;
        }

        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['documentId', 'username']
                },
                {
                    model: db.Notification,
                    as: 'notification',
                    attributes: ['documentId', 'title', 'content', 'link', 'is_global'],
                    include: [
                        {
                            model: db.NoticeType,
                            as: 'noticeType',
                            attributes: ['documentId', 'name', 'description']
                        },
                        {
                            model: db.NotificationCreated,
                            as: 'creators',
                            attributes: ['documentId'],
                            include: [
                                {
                                    model: db.User,
                                    as: 'user',
                                    attributes: ['documentId', 'username'],
                                    include: [
                                        {
                                            model: db.Media,
                                            as: 'avatarMedia',
                                            attributes: ['documentId', 'file_path']
                                        }
                                    ]
                                },
                                {
                                    model: db.Page,
                                    as: 'page',
                                    attributes: ['documentId', 'page_name'],
                                    iclude: [
                                        {
                                            model: db.Media,
                                            as: 'profileImage',
                                            attributes: ['documentId', 'file_path']
                                        }
                                    ]
                                },
                                {
                                    model: db.Group,
                                    as: 'group',
                                    attributes: ['documentId', 'group_name'],
                                    include: [
                                        {
                                            model: db.Media,
                                            as: 'image',
                                            attributes: ['documentId', 'file_path']
                                        },
                                    ]
                                },
                                {
                                    model: db.Event,
                                    as: 'event',
                                    attributes: ['documentId', 'name'],
                                    include: [
                                        {
                                            model: db.Media,
                                            as: "image",
                                            attributes: ["documentId", "file_path"],
                                        },
                                    ]
                                }
                            ]
                        }
                    ]
                }
            );
        }

        // Thực hiện truy vấn
        const { count, rows } = await db.UserNotification.findAndCountAll({
            where: whereConditions,
            include: includes,
            order: [[sortField, sortOrder]],
            offset,
            limit: pageSize,
            distinct: true
        });

        return {
            data: rows,
            meta: {
                pagination: {
                    page: parseInt(page),
                    pageSize: parseInt(pageSize),
                    pageCount: Math.ceil(count / pageSize),
                    total: count
                }
            }
        };
    } catch (error) {
        throw new Error(`Lỗi khi lấy danh sách thông báo người dùng: ${error.message}`);
    }
};

// Lấy thông báo người dùng theo ID
export const getUserNotificationById = async (documentId) => {
    try {
        const userNotification = await db.UserNotification.findByPk(documentId, {
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['documentId', 'username', 'email', 'avatar_id']
                },
                {
                    model: db.Notification,
                    as: 'notification',
                    attributes: ['documentId', 'title', 'content', 'link', 'is_global'],
                    include: [
                        {
                            model: db.NoticeType,
                            as: 'noticeType',
                            attributes: ['documentId', 'name', 'description']
                        },
                        {
                            model: db.NotificationCreated,
                            as: 'creators',
                            attributes: ['documentId', 'user_id', 'page_id', 'group_id', 'event_id', 'createdAt'],
                            include: [
                                {
                                    model: db.User,
                                    as: 'user',
                                    attributes: ['documentId', 'username', 'email', 'avatar_id']
                                },
                                {
                                    model: db.Page,
                                    as: 'page',
                                    attributes: ['documentId', 'page_name']
                                },
                                {
                                    model: db.Group,
                                    as: 'group',
                                    attributes: ['documentId', 'group_name']
                                },
                                {
                                    model: db.Event,
                                    as: 'event',
                                    attributes: ['documentId', 'name']
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!userNotification) {
            throw new Error('Không tìm thấy thông báo người dùng');
        }

        return userNotification;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin thông báo người dùng: ${error.message}`);
    }
};

// Tạo thông báo người dùng mới
export const createUserNotification = async (userNotificationData) => {
    try {
        const newUserNotification = await db.UserNotification.create(userNotificationData);
        return newUserNotification
    } catch (error) {
        throw new Error(`Lỗi khi tạo thông báo người dùng mới: ${error.message}`);
    }
};

// Cập nhật thông báo người dùng
export const updateUserNotification = async (documentId, userNotificationData) => {
    try {
        const userNotification = await db.UserNotification.findByPk(documentId);

        if (!userNotification) {
            throw new Error('Không tìm thấy thông báo người dùng');
        }

        await userNotification.update(userNotificationData);
        return await getUserNotificationById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật thông báo người dùng: ${error.message}`);
    }
};

// Đánh dấu thông báo đã đọc
export const markAsRead = async (documentId) => {
    try {
        const userNotification = await db.UserNotification.findByPk(documentId);

        if (!userNotification) {
            throw new Error('Không tìm thấy thông báo người dùng');
        }

        await userNotification.update({
            is_read: true,
            read_at: new Date()
        });

        return await getUserNotificationById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi đánh dấu đã đọc thông báo: ${error.message}`);
    }
};

// Đánh dấu tất cả thông báo của người dùng đã đọc
export const markAllAsRead = async (userId) => {
    try {
        await db.UserNotification.update(
            {
                is_read: true,
                read_at: new Date()
            },
            {
                where: {
                    user_id: userId,
                    is_read: false
                }
            }
        );

        return { message: 'Đã đánh dấu tất cả thông báo là đã đọc' };
    } catch (error) {
        throw new Error(`Lỗi khi đánh dấu tất cả thông báo đã đọc: ${error.message}`);
    }
};

// Xóa thông báo người dùng
export const deleteUserNotification = async (documentId) => {
    try {
        const userNotification = await db.UserNotification.findByPk(documentId);

        if (!userNotification) {
            throw new Error('Không tìm thấy thông báo người dùng');
        }

        await userNotification.destroy();
        return { message: 'Xóa thông báo người dùng thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa thông báo người dùng: ${error.message}`);
    }
}; 