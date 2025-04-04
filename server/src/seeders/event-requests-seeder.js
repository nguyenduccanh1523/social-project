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
      console.log('No events found. Skipping EventRequests seeding.');
      return;
    }

    // Lấy thông tin về Users
    const users = await queryInterface.sequelize.query(
      'SELECT documentId FROM Users LIMIT 20;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      console.log('No users found. Skipping EventRequests seeding.');
      return;
    }

    // Lấy thông tin về StatusActions
    const statusActions = await queryInterface.sequelize.query(
      'SELECT documentId, name FROM StatusActions;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (statusActions.length === 0) {
      console.log('No status actions found. Skipping EventRequests seeding.');
      return;
    }

    // Tìm ID của trạng thái cần thiết
    const pendingStatus = statusActions.find(s => s.name === 'Đang chờ')?.documentId || 'sa0001pending000000';
    const approvedStatus = statusActions.find(s => s.name === 'Đã chấp nhận')?.documentId || 'sa0002approved0000';
    const rejectedStatus = statusActions.find(s => s.name === 'Đã từ chối')?.documentId || 'sa0003rejected0000';
    
    const allStatuses = [pendingStatus, approvedStatus, rejectedStatus];

    const eventRequests = [];

    // Tạo event requests
    for (const event of events) {
      // Số lượng yêu cầu ngẫu nhiên cho mỗi sự kiện (2-8 yêu cầu)
      const requestCount = Math.floor(Math.random() * 7) + 2;
      
      // Tạo danh sách index người dùng ngẫu nhiên để không bị trùng lặp
      const userIndexes = [];
      while (userIndexes.length < requestCount && userIndexes.length < users.length) {
        const randIndex = Math.floor(Math.random() * users.length);
        if (!userIndexes.includes(randIndex)) {
          userIndexes.push(randIndex);
        }
      }
      
      // Tạo yêu cầu tham gia sự kiện từ danh sách index
      for (const userIndex of userIndexes) {
        const statusIndex = Math.floor(Math.random() * allStatuses.length);
        
        eventRequests.push({
          documentId: uuidv4(),
          request_status: allStatuses[statusIndex],
          event_id: event.documentId,
          user_request: users[userIndex].documentId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    return queryInterface.bulkInsert('EventRequests', eventRequests);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('EventRequests', null, {});
  }
}; 