'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Lấy thông tin về Users
      const users = await queryInterface.sequelize.query(
        'SELECT documentId FROM Users;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (users.length === 0) {
        console.log('No users found. Skipping UserNotifications seeding.');
        return;
      }

      // Lấy thông tin về Notifications
      const notifications = await queryInterface.sequelize.query(
        'SELECT documentId, is_global FROM Notifications;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (notifications.length === 0) {
        console.log('No notifications found. Skipping UserNotifications seeding.');
        return;
      }

      const userNotifications = [];
      
      // Xử lý thông báo toàn cục (gửi cho tất cả người dùng)
      const globalNotifications = notifications.filter(n => n.is_global);
      for (const notification of globalNotifications) {
        for (const user of users) {
          // 70% cơ hội người dùng đã đọc thông báo toàn cục
          const isRead = Math.random() < 0.7;
          const readAt = isRead ? new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)) : null;
          
          userNotifications.push({
            documentId: uuidv4(),
            is_read: isRead,
            read_at: readAt,
            user_id: user.documentId,
            notification_id: notification.documentId,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)),
            updatedAt: new Date()
          });
        }
      }
      
      // Xử lý thông báo cá nhân
      const personalNotifications = notifications.filter(n => !n.is_global);
      for (const notification of personalNotifications) {
        // Chọn ngẫu nhiên 1-5 người dùng nhận thông báo
        const numRecipients = Math.floor(Math.random() * 5) + 1;
        const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
        const recipients = shuffledUsers.slice(0, numRecipients);
        
        for (const user of recipients) {
          // 50% cơ hội người dùng đã đọc thông báo cá nhân
          const isRead = Math.random() < 0.5;
          const readAt = isRead ? new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)) : null;
          
          userNotifications.push({
            documentId: uuidv4(),
            is_read: isRead,
            read_at: readAt,
            user_id: user.documentId,
            notification_id: notification.documentId,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)),
            updatedAt: new Date()
          });
        }
      }

      // Giới hạn số lượng bản ghi để tránh quá nhiều dữ liệu
      const maxUserNotifications = 1000;
      const userNotificationsToInsert = userNotifications.slice(0, maxUserNotifications);

      console.log(`Seeding ${userNotificationsToInsert.length} user notifications...`);
      return queryInterface.bulkInsert('UserNotifications', userNotificationsToInsert);
    } catch (error) {
      console.error('Error seeding UserNotifications:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('UserNotifications', null, {});
  }
}; 