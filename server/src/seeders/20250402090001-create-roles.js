'use strict';
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Kiểm tra xem đã có dữ liệu trong bảng Roles chưa
    const existingRoles = await queryInterface.sequelize.query(
      'SELECT * FROM Roles LIMIT 1',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Nếu đã có dữ liệu, không thêm nữa
    if (existingRoles.length > 0) {
      console.log('Bảng Roles đã có dữ liệu, bỏ qua seeding.');
      return;
    }

    // Tạo các role cơ bản
    const roles = [
      {
        documentId: process.env.ROLE_USER_ID || '1',
        roleName: 'User',
        description: 'Người dùng thông thường',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        documentId: process.env.ROLE_ADMIN_ID || '2',
        roleName: 'Admin',
        description: 'Quản trị viên',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        documentId: uuidv4(),
        roleName: 'Moderator',
        description: 'Người kiểm duyệt',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Thêm dữ liệu vào bảng Roles
    await queryInterface.bulkInsert('Roles', roles, {});
    console.log('Đã thêm dữ liệu vào bảng Roles');
  },

  async down (queryInterface, Sequelize) {
    // Xóa toàn bộ dữ liệu trong bảng Roles
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
