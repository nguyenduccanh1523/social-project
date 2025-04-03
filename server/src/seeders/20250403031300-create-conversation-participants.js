'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Kiểm tra xem đã có dữ liệu trong bảng ConversationParticipants chưa
      const existingParticipants = await queryInterface.sequelize.query(
        'SELECT * FROM ConversationParticipants LIMIT 1',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ).catch(err => {
        console.log('Lỗi khi kiểm tra bảng ConversationParticipants:', err.message);
        return [];
      });

      // Nếu đã có dữ liệu, không thêm nữa
      if (existingParticipants.length > 0) {
        console.log('Bảng ConversationParticipants đã có dữ liệu, bỏ qua seeding.');
        return;
      }

      // Lấy User IDs từ env hoặc từ bảng Users
      let user1Id = process.env.USER_1_ID;
      let user2Id = process.env.USER_2_ID;
      let adminId = process.env.ADMIN_ID;
      
      if (!user1Id || !user2Id || !adminId) {
        try {
          const users = await queryInterface.sequelize.query(
            'SELECT documentId, username FROM Users',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
          );
          
          if (users.length > 0) {
            const user1 = users.find(user => user.username === 'user1');
            const user2 = users.find(user => user.username === 'user2');
            const admin = users.find(user => user.username === 'admin');
            
            if (user1) user1Id = user1.documentId;
            if (user2) user2Id = user2.documentId;
            if (admin) adminId = admin.documentId;
          } else {
            console.log('Không tìm thấy users cho ConversationParticipants');
            return;
          }
        } catch (error) {
          console.log('Không thể lấy user_id cho ConversationParticipants:', error.message);
          return;
        }
      }

      // Lấy conversation IDs trực tiếp từ bảng Conversations
      let conversations = [];
      try {
        conversations = await queryInterface.sequelize.query(
          'SELECT documentId, is_group_chat FROM Conversations',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        
        if (conversations.length < 1) {
          console.log('Không tìm thấy conversations, hãy thêm conversations trước');
          return;
        }
      } catch (error) {
        console.log('Không thể lấy conversation_id:', error.message);
        return;
      }
      
      // Lấy conversation cho cá nhân và nhóm
      const personalConversation = conversations.find(c => c.is_group_chat === 0);
      const groupConversation = conversations.find(c => c.is_group_chat === 1);
      
      if (!personalConversation || !groupConversation) {
        console.log('Không tìm thấy đủ loại conversations để thêm participants');
        return;
      }
      
      // Tạo dữ liệu mẫu cho ConversationParticipants
      const participants = [
        {
          documentId: uuidv4(),
          conversation_id: personalConversation.documentId,
          user_id: user1Id,
          isAdmin: true,
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        },
        {
          documentId: uuidv4(),
          conversation_id: personalConversation.documentId,
          user_id: user2Id,
          isAdmin: false,
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        },
        {
          documentId: uuidv4(),
          conversation_id: groupConversation.documentId,
          user_id: user1Id,
          isAdmin: true,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          documentId: uuidv4(),
          conversation_id: groupConversation.documentId,
          user_id: user2Id,
          isAdmin: false,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          documentId: uuidv4(),
          conversation_id: groupConversation.documentId,
          user_id: adminId,
          isAdmin: false,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        }
      ];

      // Thêm dữ liệu vào bảng ConversationParticipants
      await queryInterface.bulkInsert('ConversationParticipants', participants, {});
      console.log('Đã thêm dữ liệu vào bảng ConversationParticipants');
    } catch (error) {
      console.error('Lỗi khi seed ConversationParticipants:', error.message);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ConversationParticipants', null, {});
  }
}; 