'use strict';
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Kiểm tra xem đã có dữ liệu trong bảng chưa
      const existingSettings = await queryInterface.sequelize.query(
        'SELECT COUNT(*) as count FROM NotificationSettings;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (existingSettings[0].count > 0) {
        console.log('NotificationSettings table already has data. Skipping seeding.');
        return;
      }

      // Lấy thông tin về Users
      const users = await queryInterface.sequelize.query(
        'SELECT documentId FROM Users LIMIT 10;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (users.length === 0) {
        console.log('No users found. Skipping NotificationSettings seeding.');
        return;
      }

      // Lấy thông tin về NoticeTypes
      const noticeTypes = await queryInterface.sequelize.query(
        'SELECT documentId FROM NoticeTypes;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (noticeTypes.length === 0) {
        console.log('No notice types found. Skipping NotificationSettings seeding.');
        return;
      }

      // Lấy thông tin về Groups (nếu có)
      let groups = [];
      try {
        groups = await queryInterface.sequelize.query(
          'SELECT documentId FROM `Groups` LIMIT 5;',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
      } catch (error) {
        console.log('Groups table not found or error. Continuing without group settings.');
      }

      const notificationSettings = [];
      const settingsMap = new Map(); // Để kiểm tra trùng lặp

      // Tạo cài đặt thông báo cho mỗi người dùng với từng loại thông báo
      for (const user of users) {
        for (const noticeType of noticeTypes) {
          // Tạo khóa duy nhất cho cài đặt thông báo cá nhân
          const personalKey = `${user.documentId}_${noticeType.documentId}_null`;
          
          // Chỉ thêm nếu chưa tồn tại
          if (!settingsMap.has(personalKey)) {
            notificationSettings.push({
              documentId: uuidv4(),
              is_enabled: Math.random() > 0.1, // 90% cơ hội bật thông báo
              user_id: user.documentId,
              group_id: null,
              notice_type_id: noticeType.documentId,
              createdAt: new Date(),
              updatedAt: new Date()
            });
            
            settingsMap.set(personalKey, true);
          }
        }
      }

      // Tạo cài đặt thông báo cho nhóm
      if (groups.length > 0) {
        for (const user of users) {
          // Chỉ chọn một số nhóm ngẫu nhiên cho mỗi người dùng
          const userGroups = [...groups].sort(() => 0.5 - Math.random()).slice(0, Math.min(2, groups.length));
          
          for (const group of userGroups) {
            // Chỉ chọn một số loại thông báo ngẫu nhiên cho mỗi nhóm
            const groupNoticeTypes = [...noticeTypes].sort(() => 0.5 - Math.random()).slice(0, Math.min(3, noticeTypes.length));
            
            for (const noticeType of groupNoticeTypes) {
              // Tạo khóa duy nhất cho cài đặt thông báo nhóm
              const groupKey = `${user.documentId}_${noticeType.documentId}_${group.documentId}`;
              
              // Chỉ thêm nếu chưa tồn tại
              if (!settingsMap.has(groupKey)) {
                notificationSettings.push({
                  documentId: uuidv4(),
                  is_enabled: Math.random() > 0.2, // 80% cơ hội bật thông báo nhóm
                  user_id: user.documentId,
                  group_id: group.documentId,
                  notice_type_id: noticeType.documentId,
                  createdAt: new Date(),
                  updatedAt: new Date()
                });
                
                settingsMap.set(groupKey, true);
              }
            }
          }
        }
      }

      console.log(`Seeding ${notificationSettings.length} notification settings...`);
      return queryInterface.bulkInsert('NotificationSettings', notificationSettings);
    } catch (error) {
        console.error('Error seeding NotificationSettings:', error.errors ?? error);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('NotificationSettings', null, {});
  }
}; 