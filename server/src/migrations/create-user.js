'use strict';
/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        defaultValue: uuidv4,
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: false,  // Đảm bảo firstName không thể trống
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,  // Đảm bảo email không thể trống
        unique: true,      // Đảm bảo email là duy nhất
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,  // Đảm bảo password không thể trống
      },
      profilePicture: {
        type: Sequelize.STRING,
        allowNull: true,   // Profile picture là tùy chọn
      },
      bio: {
        type: Sequelize.STRING,
        allowNull: true,   // Bio là tùy chọn
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: true,   // Date of Birth là tùy chọn
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,   // Phone là tùy chọn
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true,   // Gender là tùy chọn
      },
      relationship: {
        type: Sequelize.STRING,
        allowNull: true,   // Relationship là tùy chọn
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,   // Address là tùy chọn
      },
      role_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Roles',   // Tên bảng cha
          key: 'id'         // Khóa ngoại ở bảng Users
        },
        allowNull: false,  // Đảm bảo role_id không thể trống
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,  // Tự động gán thời gian tạo
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,  // Tự động gán thời gian cập nhật
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};