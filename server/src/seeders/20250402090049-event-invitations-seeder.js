'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Lấy thông tin về Events
      const events = await queryInterface.sequelize.query(
        'SELECT documentId FROM Events LIMIT 15;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (events.length === 0) {
        console.log('No events found. Skipping EventInvitations seeding.');
        return;
      }

      // Lấy thông tin về thành viên trong sự kiện
      let eventMembers = [];
      try {
        eventMembers = await queryInterface.sequelize.query(
          'SELECT event_id, user_id FROM eventmembers LIMIT 100;',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        if (eventMembers.length === 0) {
          console.log('No event members found. Will use all users as potential inviters.');
        }
      } catch (error) {
        console.log('event_members table not found or error. Will use all users as potential inviters.');
      }

      // Lấy thông tin về Users
      const users = await queryInterface.sequelize.query(
        'SELECT documentId FROM Users LIMIT 30;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (users.length === 0) {
        console.log('No users found. Skipping EventInvitations seeding.');
        return;
      }

      // Lấy thông tin về StatusActions
      let statusActions = [];
      try {
        statusActions = await queryInterface.sequelize.query(
          'SELECT documentId, name FROM StatusActions;',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
      } catch (error) {
        console.log('StatusActions table not found or error. Using default status IDs.');
      }

      // Tìm ID của trạng thái cần thiết - sử dụng giá trị mặc định nếu không tìm thấy
      const pendingStatus = statusActions.find(s => s.name === 'Đang chờ')?.documentId || 'sa0001pending000000';
      const approvedStatus = statusActions.find(s => s.name === 'Đã chấp nhận')?.documentId || 'sa0002approved0000';
      const rejectedStatus = statusActions.find(s => s.name === 'Đã từ chối')?.documentId || 'sa0003rejected0000';
      
      const allStatuses = [pendingStatus, approvedStatus, rejectedStatus];

      const eventInvitations = [];

      // Tạo event invitations
      for (const event of events) {
        // Xác định những người có thể mời trong sự kiện này
        let potentialInviters = [];
        
        if (eventMembers.length > 0) {
          // Nếu có dữ liệu event_members, lấy thành viên của sự kiện hiện tại
          potentialInviters = eventMembers
            .filter(member => member.event_id === event.documentId)
            .map(member => member.user_id);
        }
        
        // Nếu không có thành viên nào, lấy ngẫu nhiên 3 người dùng làm người mời
        if (potentialInviters.length === 0) {
          for (let i = 0; i < 3 && i < users.length; i++) {
            potentialInviters.push(users[i].documentId);
          }
        }

        // Với mỗi người mời tiềm năng, tạo 1-3 lời mời
        for (const inviterId of potentialInviters) {
          // Số lượng lời mời cho mỗi người (1-3 lời mời)
          const invitationCount = Math.floor(Math.random() * 3) + 1;
          
          // Tạo danh sách người được mời
          const invitedUsers = [];
          while (invitedUsers.length < invitationCount && invitedUsers.length < users.length) {
            const randIndex = Math.floor(Math.random() * users.length);
            const potentialInvitee = users[randIndex].documentId;
            
            // Không mời chính mình, không mời trùng người, và không mời người đã là thành viên
            if (potentialInvitee !== inviterId && 
                !invitedUsers.includes(potentialInvitee) &&
                !potentialInviters.includes(potentialInvitee)) {
              invitedUsers.push(potentialInvitee);
            }
          }
          
          // Tạo lời mời tham gia sự kiện
          for (const invitedUser of invitedUsers) {
            const statusIndex = Math.floor(Math.random() * allStatuses.length);
            const responded = allStatuses[statusIndex] !== pendingStatus;
            const createdDate = new Date();
            createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30)); // Ngày tạo trong 30 ngày qua
            
            eventInvitations.push({
              documentId: uuidv4(),
              invitation_status: allStatuses[statusIndex],
              responded_at: responded ? new Date() : null,
              event_id: event.documentId,
              invited_by: inviterId,
              invited_to: invitedUser,
              createdAt: createdDate,
              updatedAt: createdDate
            });
          }
        }
      }

      // Giới hạn số lượng lời mời để tránh vấn đề hiệu suất
      const limitedInvitations = eventInvitations.slice(0, 200);
      
      console.log(`Seeding ${limitedInvitations.length} event invitations...`);
      return queryInterface.bulkInsert('EventInvitations', limitedInvitations);
    } catch (error) {
      console.error('Error seeding event invitations:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('EventInvitations', null, {});
  }
}; 