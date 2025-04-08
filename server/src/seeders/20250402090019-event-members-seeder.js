'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy thông tin về Events
    const events = await queryInterface.sequelize.query(
      'SELECT documentId FROM Events;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (events.length === 0) {
      console.log('No events found. Skipping EventMembers seeding.');
      return;
    }

    // Lấy thông tin về Users
    const users = await queryInterface.sequelize.query(
      'SELECT documentId FROM Users LIMIT 20;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      console.log('No users found. Skipping EventMembers seeding.');
      return;
    }

    const eventMembers = [];

    // Các trạng thái thành viên sự kiện
    const statuses = ['going', 'interested', 'not going'];

    // Tạo thành viên sự kiện
    for (const event of events) {
      // Số lượng thành viên ngẫu nhiên cho mỗi sự kiện (5-15 người)
      const memberCount = Math.floor(Math.random() * 11) + 5;
      
      // Tạo danh sách index người dùng ngẫu nhiên để không bị trùng lặp
      const userIndexes = [];
      while (userIndexes.length < memberCount && userIndexes.length < users.length) {
        const randIndex = Math.floor(Math.random() * users.length);
        if (!userIndexes.includes(randIndex)) {
          userIndexes.push(randIndex);
        }
      }
      
      // Tạo thành viên sự kiện từ danh sách index
      for (const userIndex of userIndexes) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        eventMembers.push({
          documentId: uuidv4(),
          event_id: event.documentId,
          user_id: users[userIndex].documentId,
          status,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    return queryInterface.bulkInsert('EventMembers', eventMembers);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('EventMembers', null, {});
  }
}; 