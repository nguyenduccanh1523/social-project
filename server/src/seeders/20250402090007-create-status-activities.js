'use strict';
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Kiểm tra xem đã có dữ liệu trong bảng StatusActivities chưa
    const existingStatus = await queryInterface.sequelize.query(
      'SELECT * FROM StatusActivities LIMIT 1',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    ).catch(error => {
      console.log('Lỗi khi kiểm tra bảng StatusActivities:', error.message);
      return []; // Trả về mảng rỗng trong trường hợp lỗi
    });

    // Nếu đã có dữ liệu, không thêm nữa
    if (existingStatus && existingStatus.length > 0) {
      console.log('Bảng StatusActivities đã có dữ liệu, bỏ qua seeding.');
      return;
    }

    // Tạo các status activity cơ bản
    const statusActivities = [
      {
        documentId: uuidv4(),
        name: 'Online',
        description: 'Người dùng đang online',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        documentId: uuidv4(),
        name: 'Offline',
        description: 'Người dùng đang offline',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        documentId: uuidv4(),
        name: 'Away',
        description: 'Người dùng tạm vắng',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        documentId: uuidv4(),
        name: 'Do Not Disturb',
        description: 'Không làm phiền',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        documentId: uuidv4(),
        name: 'Invisible',
        description: 'Ẩn trạng thái',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    try {
      // Thêm dữ liệu vào bảng StatusActivities
      await queryInterface.bulkInsert('StatusActivities', statusActivities, {});
      console.log('Đã thêm dữ liệu vào bảng StatusActivities');
    } catch (error) {
      console.log('Lỗi khi thêm dữ liệu vào bảng StatusActivities:', error.message);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Xóa toàn bộ dữ liệu trong bảng StatusActivities
      await queryInterface.bulkDelete('StatusActivities', null, {});
    } catch (error) {
      console.log('Lỗi khi xóa dữ liệu trong bảng StatusActivities:', error.message);
    }
  }
};
