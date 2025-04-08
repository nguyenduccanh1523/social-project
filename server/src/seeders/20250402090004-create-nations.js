'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Kiểm tra xem đã có dữ liệu trong bảng Nations chưa
      const existingNations = await queryInterface.sequelize.query(
        'SELECT * FROM Nations LIMIT 1',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      // Nếu đã có dữ liệu, không thêm nữa
      if (existingNations.length > 0) {
        console.log('Bảng Nations đã có dữ liệu, bỏ qua seeding.');
        return;
      }

      // Tạo dữ liệu mẫu cho Nations
      const nations = [
        {
          documentId: uuidv4(),
          name: 'Việt Nam',
          niceName: 'Vietnam',
          iso: 'VN',
          phoneCode: '84',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          name: 'United States',
          niceName: 'United States',
          iso: 'US',
          phoneCode: '1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          name: 'Japan',
          niceName: 'Japan',
          iso: 'JP',
          phoneCode: '81',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          name: 'South Korea',
          niceName: 'South Korea',
          iso: 'KR',
          phoneCode: '82',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          name: 'Singapore',
          niceName: 'Singapore',
          iso: 'SG',
          phoneCode: '65',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      // Lưu ID của Việt Nam để sử dụng cho các model khác
      process.env.NATION_VN_ID = nations[0].documentId;

      // Thêm dữ liệu vào bảng Nations
      await queryInterface.bulkInsert('Nations', nations, {});
      console.log('Đã thêm dữ liệu vào bảng Nations');
    } catch (error) {
      console.error('Lỗi khi seed Nations:', error.message);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Nations', null, {});
  }
}; 