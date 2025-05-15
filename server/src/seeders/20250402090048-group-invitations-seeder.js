'use strict';
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Lấy thông tin về Groups
      const groups = await queryInterface.sequelize.query(
        'SELECT documentId FROM `Groups` LIMIT 15;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (groups.length === 0) {
        console.log('No groups found. Skipping group_invitations seeding.');
        return;
      }

      // Lấy thông tin về thành viên trong các nhóm
      let groupMembers = [];
      try {
        groupMembers = await queryInterface.sequelize.query(
          'SELECT group_id, user_id FROM group_members LIMIT 100;',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        
        if (groupMembers.length === 0) {
          console.log('No group members found. Will use all users as potential inviters.');
        }
      } catch (error) {
        console.log('group_members table not found or error. Will use all users as potential inviters.');
      }

      // Lấy thông tin về Users
      const users = await queryInterface.sequelize.query(
        'SELECT documentId FROM Users LIMIT 30;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (users.length === 0) {
        console.log('No users found. Skipping group_invitations seeding.');
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

      const groupInvitations = [];

      // Tạo group invitations
      for (const group of groups) {
        // Xác định những người có thể mời trong nhóm này
        let potentialInviters = [];
        
        if (groupMembers.length > 0) {
          // Nếu có dữ liệu group_members, lấy thành viên của nhóm hiện tại
          potentialInviters = groupMembers
            .filter(member => member.group_id === group.documentId)
            .map(member => member.user_id);
        }
        
        // Nếu không có thành viên nào, lấy ngẫu nhiên 3 người dùng làm người mời
        if (potentialInviters.length === 0) {
          for (let i = 0; i < 3 && i < users.length; i++) {
            potentialInviters.push(users[i].documentId);
          }
        }

        // Với mỗi người mời tiềm năng, tạo 1-4 lời mời
        for (const inviterId of potentialInviters) {
          // Số lượng lời mời cho mỗi người (1-4 lời mời)
          const invitationCount = Math.floor(Math.random() * 4) + 1;
          
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
          
          // Tạo lời mời tham gia nhóm
          for (const invitedUser of invitedUsers) {
            const statusIndex = Math.floor(Math.random() * allStatuses.length);
            const responded = allStatuses[statusIndex] !== pendingStatus;
            const createdDate = new Date();
            createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30)); // Ngày tạo trong 30 ngày qua
            
            groupInvitations.push({
              documentId: uuidv4(),
              status_action_id: allStatuses[statusIndex],
              responded_at: responded ? new Date() : null,
              group_id: group.documentId,
              invited_by: inviterId,
              invited_to: invitedUser,
              created_at: createdDate,
              updated_at: new Date(),
              createdAt: createdDate,
              updatedAt: new Date()
            });
          }
        }
      }

      // Giới hạn số lượng lời mời để tránh vấn đề hiệu suất
      const limitedInvitations = groupInvitations.slice(0, 200);
      
      console.log(`Seeding ${limitedInvitations.length} group invitations...`);
      return queryInterface.bulkInsert('group_invitations', limitedInvitations);
    } catch (error) {
      console.error('Error seeding group invitations:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('group_invitations', null, {});
  }
}; 