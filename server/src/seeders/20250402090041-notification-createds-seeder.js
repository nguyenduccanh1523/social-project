'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Lấy thông tin về Notifications
      const notifications = await queryInterface.sequelize.query(
        'SELECT documentId FROM Notifications;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (notifications.length === 0) {
        console.log('No notifications found. Skipping NotificationCreateds seeding.');
        return;
      }

      // Lấy thông tin về Users
      const users = await queryInterface.sequelize.query(
        'SELECT documentId FROM Users LIMIT 20;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (users.length === 0) {
        console.log('No users found. Skipping NotificationCreateds seeding.');
        return;
      }

      // Lấy thông tin về Groups (nếu có)
      let groups = [];
      try {
        groups = await queryInterface.sequelize.query(
          'SELECT documentId FROM `Groups` LIMIT 10;',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
      } catch (error) {
        console.log('Groups table not found or error. Continuing without groups.');
      }

      // Lấy thông tin về Pages (nếu có)
      let pages = [];
      try {
        pages = await queryInterface.sequelize.query(
          'SELECT documentId FROM Pages LIMIT 10;',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
      } catch (error) {
        console.log('Pages table not found or error. Continuing without pages.');
      }

      // Lấy thông tin về Events (nếu có)
      let events = [];
      try {
        events = await queryInterface.sequelize.query(
          'SELECT documentId FROM Events LIMIT 10;',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
      } catch (error) {
        console.log('Events table not found or error. Continuing without events.');
      }

      const notificationCreateds = [];
      
      // Với mỗi thông báo, tạo người tạo thông báo
      for (const notification of notifications) {
        // Xác định loại nguồn thông báo
        const sourceType = Math.random();
        
        if (sourceType < 0.6) {
          // 60% thông báo từ người dùng
          const userIndex = Math.floor(Math.random() * users.length);
          
          notificationCreateds.push({
            documentId: uuidv4(),
            notification_id: notification.documentId,
            user_id: users[userIndex].documentId,
            page_id: null,
            group_id: null,
            event_id: null,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        } else if (sourceType < 0.75 && groups.length > 0) {
          // 15% thông báo từ nhóm
          const groupIndex = Math.floor(Math.random() * groups.length);
          
          notificationCreateds.push({
            documentId: uuidv4(),
            notification_id: notification.documentId,
            user_id: null,
            page_id: null,
            group_id: groups[groupIndex].documentId,
            event_id: null,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        } else if (sourceType < 0.9 && pages.length > 0) {
          // 15% thông báo từ trang
          const pageIndex = Math.floor(Math.random() * pages.length);
          
          notificationCreateds.push({
            documentId: uuidv4(),
            notification_id: notification.documentId,
            user_id: null,
            page_id: pages[pageIndex].documentId,
            group_id: null,
            event_id: null,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        } else if (events.length > 0) {
          // 10% thông báo từ sự kiện
          const eventIndex = Math.floor(Math.random() * events.length);
          
          notificationCreateds.push({
            documentId: uuidv4(),
            notification_id: notification.documentId,
            user_id: null,
            page_id: null,
            group_id: null,
            event_id: events[eventIndex].documentId,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        } else {
          // Nếu không có groups/pages/events, mặc định là từ người dùng
          const userIndex = Math.floor(Math.random() * users.length);
          
          notificationCreateds.push({
            documentId: uuidv4(),
            notification_id: notification.documentId,
            user_id: users[userIndex].documentId,
            page_id: null,
            group_id: null,
            event_id: null,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }

      console.log(`Seeding ${notificationCreateds.length} notification createds...`);
      return queryInterface.bulkInsert('NotificationCreateds', notificationCreateds);
    } catch (error) {
      console.error('Error seeding NotificationCreateds:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('NotificationCreateds', null, {});
  }
}; 