'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Kiểm tra xem đã có dữ liệu trong bảng Socials chưa
      const existingSocials = await queryInterface.sequelize.query(
        'SELECT * FROM Socials LIMIT 1',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ).catch(err => {
        console.log('Lỗi khi kiểm tra bảng Socials:', err.message);
        return [];
      });

      // Nếu đã có dữ liệu, không thêm nữa
      if (existingSocials.length > 0) {
        console.log('Bảng Socials đã có dữ liệu, bỏ qua seeding.');
        return;
      }
      
      // Tạo dữ liệu mẫu cho Socials
      const social1Id = uuidv4();
      const social2Id = uuidv4();
      const social3Id = uuidv4();
      
      // Lưu social IDs vào env để sử dụng cho các models khác
      process.env.SOCIAL_1_ID = social1Id;
      process.env.SOCIAL_2_ID = social2Id;
      process.env.SOCIAL_3_ID = social3Id;
      
      const socials = [
        {
          documentId: social1Id,
          platform: 'Facebook',
          iconUrl: 'fab fa-facebook',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: social2Id,
          platform: 'Twitter',
          iconUrl: 'fab fa-twitter',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: social3Id,
          platform: 'LinkedIn',
          iconUrl: 'fab fa-linkedin',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      // Thêm dữ liệu vào bảng Socials
      await queryInterface.bulkInsert('Socials', socials, {});
      console.log('Đã thêm dữ liệu vào bảng Socials');
    } catch (error) {
      console.error('Lỗi khi seed Socials:', error.message);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Socials', null, {});
  }
}; 