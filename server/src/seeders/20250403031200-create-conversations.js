'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Kiểm tra xem đã có dữ liệu trong bảng Conversations chưa
      const existingConversations = await queryInterface.sequelize.query(
        'SELECT * FROM Conversations LIMIT 1',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ).catch(err => {
        console.log('Lỗi khi kiểm tra bảng Conversations:', err.message);
        return [];
      });

      // Nếu đã có dữ liệu, không thêm nữa
      if (existingConversations.length > 0) {
        console.log('Bảng Conversations đã có dữ liệu, bỏ qua seeding.');
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
          }
        } catch (error) {
          console.log('Không thể lấy user_id cho conversations:', error.message);
          return;
        }
      }

      // Lấy Media ID cho ảnh nhóm chat
      let mediaId = null;
      try {
        const medias = await queryInterface.sequelize.query(
          'SELECT documentId FROM Medias LIMIT 1',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        
        if (medias.length > 0) {
          mediaId = medias[0].documentId;
        }
      } catch (error) {
        console.log('Không thể lấy media_id cho conversation:', error.message);
      }
      
      // Tạo dữ liệu mẫu cho Conversations
      const conversation1Id = uuidv4();
      const conversation2Id = uuidv4();
      
      // Lưu conversation IDs vào env để sử dụng cho các models khác
      process.env.CONVERSATION_1_ID = conversation1Id;
      process.env.CONVERSATION_2_ID = conversation2Id;
      
      const conversations = [
        {
          documentId: conversation1Id,
          name: null, // Cuộc trò chuyện cá nhân
          is_group_chat: false,
          conversation_created_by: user1Id,
          user_chated_with: user2Id,
          image_group_chat: null,
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 ngày trước
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 ngày trước (có tin nhắn mới)
        },
        {
          documentId: conversation2Id,
          name: 'Nhóm chat bạn bè',
          is_group_chat: true,
          conversation_created_by: user1Id,
          user_chated_with: null,
          image_group_chat: mediaId,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 ngày trước
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 ngày trước
        }
      ];

      // Thêm dữ liệu vào bảng Conversations
      await queryInterface.bulkInsert('Conversations', conversations, {});
      console.log('Đã thêm dữ liệu vào bảng Conversations');
    } catch (error) {
      console.error('Lỗi khi seed Conversations:', error.message);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Conversations', null, {});
  }
}; 