'use strict';
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy thông tin DocumentShares
    const documentShares = await queryInterface.sequelize.query(
      'SELECT documentId FROM DocumentShares;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (documentShares.length === 0) {
      console.log('No DocumentShares found. Skipping CmtDocuments seeding.');
      return;
    }

    // Lấy thông tin Users
    const users = await queryInterface.sequelize.query(
      'SELECT documentId FROM Users LIMIT 10;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      console.log('No Users found. Skipping CmtDocuments seeding.');
      return;
    }

    const comments = [];
    const parentComments = [];

    // Danh sách nội dung bình luận
    const commentContents = [
      'Tài liệu rất hay và bổ ích!',
      'Cảm ơn bạn đã chia sẻ tài liệu này.',
      'Tôi đã áp dụng những hướng dẫn trong tài liệu và nhận thấy hiệu quả rõ rệt.',
      'Phần nội dung chính rất dễ hiểu và đầy đủ.',
      'Liệu có thể cập nhật thêm một số ví dụ mới không?',
      'Tôi nghĩ tài liệu này nên được chia sẻ rộng rãi hơn.',
      'Nội dung rất chi tiết và dễ áp dụng.',
      'Tài liệu giúp tôi hiểu rõ hơn về chủ đề này.',
      'Có thể bổ sung thêm hình ảnh minh họa được không?',
      'Xin chúc mừng tác giả đã tạo ra một tài liệu chất lượng.'
    ];

    // Tạo bình luận chính (parent comments)
    for (let i = 0; i < 20; i++) {
      const commentId = uuidv4();
      const document_id = documentShares[Math.floor(Math.random() * documentShares.length)].documentId;
      const user_id = users[Math.floor(Math.random() * users.length)].documentId;
      const content = commentContents[Math.floor(Math.random() * commentContents.length)];
      
      const comment = {
        documentId: commentId,
        document_id,
        user_id,
        parent_id: null,
        content,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      comments.push(comment);
      parentComments.push(commentId);
    }

    // Tạo bình luận phản hồi (child comments)
    const replyContents = [
      'Tôi hoàn toàn đồng ý với bạn!',
      'Cảm ơn phản hồi của bạn.',
      'Tôi cũng có cùng trải nghiệm.',
      'Điểm này rất đáng lưu ý.',
      'Bạn có thể chia sẻ thêm kinh nghiệm không?',
      'Tôi thấy ý kiến của bạn rất hữu ích.',
      'Sẽ tốt hơn nếu chúng ta thảo luận thêm về chủ đề này.',
      'Cảm ơn góp ý của bạn!',
      'Tôi sẽ cân nhắc đề xuất của bạn.'
    ];

    // Tạo 15 bình luận phản hồi
    for (let i = 0; i < 15; i++) {
      const parent_id = parentComments[Math.floor(Math.random() * parentComments.length)];
      
      // Tìm thông tin của parent comment
      const parentComment = comments.find(c => c.documentId === parent_id);
      if (!parentComment) continue;
      
      comments.push({
        documentId: uuidv4(),
        document_id: parentComment.document_id,
        user_id: users[Math.floor(Math.random() * users.length)].documentId,
        parent_id,
        content: replyContents[Math.floor(Math.random() * replyContents.length)],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return queryInterface.bulkInsert('CmtDocuments', comments);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('CmtDocuments', null, {});
  }
}; 