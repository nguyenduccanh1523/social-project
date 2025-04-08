'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Lấy thông tin về Conversations
      const conversations = await queryInterface.sequelize.query(
        'SELECT documentId, is_group_chat, conversation_created_by, user_chated_with FROM Conversations;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (conversations.length === 0) {
        console.log('No conversations found. Skipping ConversationParticipants seeding.');
        return;
      }

      // Lấy thông tin về Users
      const users = await queryInterface.sequelize.query(
        'SELECT documentId FROM Users LIMIT 30;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (users.length === 0) {
        console.log('No users found. Skipping ConversationParticipants seeding.');
        return;
      }

      const participants = [];
      
      // Với mỗi cuộc trò chuyện, thêm người tham gia
      for (const conversation of conversations) {
        // Phân biệt xử lý giữa chat cá nhân và nhóm
        if (!conversation.is_group_chat) {
          // Chat cá nhân - 2 người tham gia
          
          // Người tạo cuộc trò chuyện
          participants.push({
            documentId: uuidv4(),
            isAdmin: true, // Người tạo luôn là admin
            conversation_id: conversation.documentId,
            user_id: conversation.conversation_created_by,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          // Người được mời chat
          participants.push({
            documentId: uuidv4(),
            isAdmin: false,
            conversation_id: conversation.documentId,
            user_id: conversation.user_chated_with,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        } else {
          // Chat nhóm - nhiều người tham gia
          
          // Người tạo nhóm
          participants.push({
            documentId: uuidv4(),
            isAdmin: true, // Người tạo luôn là admin
            conversation_id: conversation.documentId,
            user_id: conversation.conversation_created_by,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          // Số lượng thành viên cho mỗi nhóm (3-10 người)
          const memberCount = Math.floor(Math.random() * 8) + 3;
          
          // Danh sách thành viên đã thêm để tránh trùng lặp
          const addedMembers = [conversation.conversation_created_by]; // Đã thêm người tạo
          
          // Thêm thành viên ngẫu nhiên
          while (addedMembers.length < memberCount && addedMembers.length < users.length) {
            const randIndex = Math.floor(Math.random() * users.length);
            const potentialMember = users[randIndex].documentId;
            
            // Không thêm trùng người
            if (!addedMembers.includes(potentialMember)) {
              addedMembers.push(potentialMember);
              
              // Xác định xem có phải admin không (15% cơ hội)
              const isAdmin = Math.random() < 0.15;
              
              participants.push({
                documentId: uuidv4(),
                isAdmin: isAdmin,
                conversation_id: conversation.documentId,
                user_id: potentialMember,
                createdAt: new Date(),
                updatedAt: new Date()
              });
            }
          }
        }
      }

      console.log(`Seeding ${participants.length} conversation participants...`);
      return queryInterface.bulkInsert('ConversationParticipants', participants);
    } catch (error) {
      console.error('Error seeding ConversationParticipants:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('ConversationParticipants', null, {});
  }
}; 