'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Kiểm tra xem đã có dữ liệu trong bảng Messages chưa
      const existingMessages = await queryInterface.sequelize.query(
        'SELECT * FROM Messages LIMIT 1',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ).catch(err => {
        console.log('Lỗi khi kiểm tra bảng Messages:', err.message);
        return [];
      });

      // Nếu đã có dữ liệu, không thêm nữa
      if (existingMessages.length > 0) {
        console.log('Bảng Messages đã có dữ liệu, bỏ qua seeding.');
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
            console.log('Không tìm thấy users cho Messages');
            return;
          }
        } catch (error) {
          console.log('Không thể lấy user_id cho messages:', error.message);
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
        console.log('Không tìm thấy đủ loại conversations để thêm messages');
        return;
      }

      // Thời gian tin nhắn cho cuộc trò chuyện 1 (từ 10 ngày trước)
      const baseTime1 = Date.now() - 10 * 24 * 60 * 60 * 1000;
      
      // Thời gian tin nhắn cho cuộc trò chuyện 2 (từ 5 ngày trước)
      const baseTime2 = Date.now() - 5 * 24 * 60 * 60 * 1000;
      
      // Tạo dữ liệu mẫu cho Messages
      const messages = [
        // Tin nhắn trong conversation 1 (giữa user1 và user2)
        {
          documentId: uuidv4(),
          conversation_id: personalConversation.documentId,
          sender_id: user1Id,
          receiver_id: user2Id,
          content: 'Xin chào, bạn khỏe không?',
          is_read: true,
          media_id: null,
          createdAt: new Date(baseTime1 + 1 * 60 * 60 * 1000), // 1 giờ sau khi tạo conversation
          updatedAt: new Date(baseTime1 + 1 * 60 * 60 * 1000)
        },
        {
          documentId: uuidv4(),
          conversation_id: personalConversation.documentId,
          sender_id: user2Id,
          receiver_id: user1Id,
          content: 'Chào bạn, tôi khỏe cảm ơn bạn! Còn bạn thế nào?',
          is_read: true,
          media_id: null,
          createdAt: new Date(baseTime1 + 2 * 60 * 60 * 1000), // 2 giờ sau khi tạo conversation
          updatedAt: new Date(baseTime1 + 2 * 60 * 60 * 1000)
        },
        {
          documentId: uuidv4(),
          conversation_id: personalConversation.documentId,
          sender_id: user1Id,
          receiver_id: user2Id,
          content: 'Tôi cũng khỏe, cảm ơn!',
          is_read: true,
          media_id: null,
          createdAt: new Date(baseTime1 + 3 * 60 * 60 * 1000), // 3 giờ sau
          updatedAt: new Date(baseTime1 + 3 * 60 * 60 * 1000)
        },
        {
          documentId: uuidv4(),
          conversation_id: personalConversation.documentId,
          sender_id: user2Id,
          receiver_id: user1Id,
          content: 'Bạn có muốn đi cà phê không?',
          is_read: true,
          media_id: null,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 ngày trước
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        
        // Tin nhắn trong conversation 2 (group chat)
        {
          documentId: uuidv4(),
          conversation_id: groupConversation.documentId,
          sender_id: user1Id,
          receiver_id: null,
          content: 'Xin chào mọi người, đây là nhóm chat của chúng ta!',
          is_read: true,
          media_id: null,
          createdAt: new Date(baseTime2 + 1 * 60 * 60 * 1000), // 1 giờ sau khi tạo conversation
          updatedAt: new Date(baseTime2 + 1 * 60 * 60 * 1000)
        },
        {
          documentId: uuidv4(),
          conversation_id: groupConversation.documentId,
          sender_id: user2Id,
          receiver_id: null,
          content: 'Xin chào mọi người!',
          is_read: true,
          media_id: null,
          createdAt: new Date(baseTime2 + 2 * 60 * 60 * 1000), // 2 giờ sau khi tạo conversation
          updatedAt: new Date(baseTime2 + 2 * 60 * 60 * 1000)
        },
        {
          documentId: uuidv4(),
          conversation_id: groupConversation.documentId,
          sender_id: adminId,
          receiver_id: null,
          content: 'Xin chào các bạn! Rất vui được làm quen.',
          is_read: true,
          media_id: null,
          createdAt: new Date(baseTime2 + 3 * 60 * 60 * 1000), // 3 giờ sau
          updatedAt: new Date(baseTime2 + 3 * 60 * 60 * 1000)
        },
        {
          documentId: uuidv4(),
          conversation_id: groupConversation.documentId,
          sender_id: user1Id,
          receiver_id: null,
          content: 'Chúng ta sẽ dùng group này để trao đổi về dự án nhé!',
          is_read: true,
          media_id: null,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 ngày trước
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      ];

      // Thêm dữ liệu vào bảng Messages
      await queryInterface.bulkInsert('Messages', messages, {});
      console.log('Đã thêm dữ liệu vào bảng Messages');
    } catch (error) {
      console.error('Lỗi khi seed Messages:', error.message);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Messages', null, {});
  }
}; 