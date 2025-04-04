'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Lấy thông tin về Conversations và participants
      let conversations = [];
      try {
        conversations = await queryInterface.sequelize.query(
          'SELECT c.documentId, c.is_group_chat FROM Conversations c;',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
      } catch (error) {
        console.error('Error fetching conversations:', error.message);
        return;
      }

      if (conversations.length === 0) {
        console.log('No conversations found. Skipping Messages seeding.');
        return;
      }

      // Lấy thông tin về ConversationParticipants
      let participants = [];
      try {
        participants = await queryInterface.sequelize.query(
          'SELECT conversation_id, user_id FROM ConversationParticipants;',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
      } catch (error) {
        console.error('Error fetching conversation participants:', error.message);
        return;
      }

      if (participants.length === 0) {
        console.log('No conversation participants found. Skipping Messages seeding.');
        return;
      }

      // Lấy thông tin về Medias cho tin nhắn (tùy chọn)
      let medias = [];
      try {
        medias = await queryInterface.sequelize.query(
          "SELECT documentId FROM medias WHERE file_type LIKE '%image%' OR file_type LIKE '%video%' LIMIT 10;",
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
      } catch (error) {
        console.log('No media found for messages. Will create text messages only.');
      }

      const messages = [];
      
      // Mẫu nội dung tin nhắn
      const messageContents = [
        'Xin chào!',
        'Bạn khỏe không?',
        'Hôm nay thời tiết thế nào?',
        'Chúc ngày mới tốt lành!',
        'Ok, để mình kiểm tra nhé.',
        'Thông tin này rất hữu ích!',
        'Cảm ơn bạn nhiều!',
        'Cuối tuần này bạn có kế hoạch gì không?',
        'Rất vui được nói chuyện với bạn!',
        'Khi nào chúng ta gặp nhau?',
        'Dự án đang tiến triển tốt.',
        'Tôi sẽ gửi báo cáo vào ngày mai.',
        'Đã nhận được thông tin rồi nhé.',
        'Hẹn gặp lại bạn!',
        'Đợi mình một chút nhé.',
        'Bạn đã ăn tối chưa?',
        'Liên hệ lại với mình khi bạn rảnh nhé!',
        'Tuyệt vời!',
        'Đồng ý với ý kiến của bạn.',
        'Hãy cùng gặp nhau vào cuối tuần này!'
      ];

      // Với mỗi cuộc trò chuyện, tạo các tin nhắn
      for (const conversation of conversations) {
        // Lấy danh sách người tham gia cho cuộc trò chuyện này
        const conversationParticipants = participants.filter(p => p.conversation_id === conversation.documentId);
        
        if (conversationParticipants.length < 2) {
          console.log(`Skipping conversation ${conversation.documentId}: not enough participants.`);
          continue;
        }
        
        // Số lượng tin nhắn cho mỗi cuộc trò chuyện (5-30 tin nhắn)
        const messageCount = Math.floor(Math.random() * 26) + 5;
        
        // Thời gian bắt đầu cuộc hội thoại (7-60 ngày trước)
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (Math.floor(Math.random() * 54) + 7));
        
        // Tạo tin nhắn
        for (let i = 0; i < messageCount; i++) {
          // Chọn người gửi ngẫu nhiên từ danh sách người tham gia
          const senderIndex = Math.floor(Math.random() * conversationParticipants.length);
          const sender = conversationParticipants[senderIndex];
          
          // Chọn người nhận (chỉ áp dụng cho chat 1-1)
          let receiver = null;
          if (!conversation.is_group_chat) {
            const receiverIndex = (senderIndex + 1) % conversationParticipants.length;
            receiver = conversationParticipants[receiverIndex];
          }
          
          // Chọn nội dung tin nhắn
          const contentIndex = Math.floor(Math.random() * messageContents.length);
          
          // Xác định xem tin nhắn có media không (20% cơ hội)
          const hasMedia = medias.length > 0 && Math.random() < 0.2;
          let mediaId = null;
          
          if (hasMedia) {
            const mediaIndex = Math.floor(Math.random() * medias.length);
            mediaId = medias[mediaIndex].documentId;
          }
          
          // Tính thời gian gửi tin nhắn (tăng dần theo thời gian)
          const minutesOffset = Math.floor(Math.random() * 60) + i * 20;
          const messageDate = new Date(startDate);
          messageDate.setMinutes(messageDate.getMinutes() + minutesOffset);
          
          // Đảm bảo thời gian tin nhắn không vượt quá thời điểm hiện tại
          const now = new Date();
          const actualMessageDate = messageDate > now ? now : messageDate;
          
          // Trạng thái đã đọc (tin nhắn cũ thường đã được đọc)
          const isRead = Math.random() < 0.85; // 85% tin nhắn đã được đọc
          
          messages.push({
            documentId: uuidv4(),
            sender_id: sender.user_id,
            receiver_id: receiver ? receiver.user_id : null,
            content: hasMedia ? (Math.random() < 0.5 ? null : messageContents[contentIndex]) : messageContents[contentIndex],
            is_read: isRead,
            conversation_id: conversation.documentId,
            media_id: mediaId,
            createdAt: actualMessageDate,
            updatedAt: actualMessageDate
          });
        }
      }

      // Giới hạn số lượng tin nhắn để tránh quá tải
      const limitedMessages = messages.slice(0, 300);
      
      console.log(`Seeding ${limitedMessages.length} messages...`);
      return queryInterface.bulkInsert('Messages', limitedMessages);
    } catch (error) {
      console.error('Error seeding Messages:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Messages', null, {});
  }
}; 