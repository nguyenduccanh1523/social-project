'use strict';
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy ID của các CategorySupport
    const categorySupportIds = await queryInterface.sequelize.query(
      'SELECT documentId FROM CategorySupports;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (categorySupportIds.length === 0) {
      console.log('No CategorySupports found. Skipping FAQ seeding.');
      return;
    }

    const faqs = [];
    
    // Tạo FAQ cho mỗi danh mục hỗ trợ
    for (const cat of categorySupportIds) {
      // Tạo 2-3 FAQ ngẫu nhiên cho mỗi danh mục
      for (let i = 0; i < Math.floor(Math.random() * 2) + 2; i++) {
        faqs.push({
          documentId: uuidv4(),
          question: `Câu hỏi thường gặp #${i+1} về danh mục này?`,
          answer: `Đây là câu trả lời chi tiết cho câu hỏi #${i+1}. Chúng tôi cung cấp thông tin đầy đủ và hướng dẫn để giải quyết vấn đề của bạn.`,
          category_id: cat.documentId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    return queryInterface.bulkInsert('Faqs', faqs);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Faqs', null, {});
  }
}; 