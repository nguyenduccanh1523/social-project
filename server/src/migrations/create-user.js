'use strict';
/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      documentId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
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
      reset_password_expires: {
        type: Sequelize.DATE,
        allowNull: true
      },
      avatar_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'Medias',
          key: 'documentId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      cover_photo_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'Medias',
          key: 'documentId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      is_online: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_blocked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      about: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      refresh_token: {
        type: Sequelize.STRING,
        allowNull: true
      },
      refresh_token_expires: {
        type: Sequelize.DATE,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
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
        type: Sequelize.STRING,
        references: {
          model: 'Roles',   // Tên bảng cha
          key: 'documentId'         // Khóa ngoại ở bảng Users
        },
        allowNull: false,  // Đảm bảo role_id không thể trống
      },
      status_activity_id: {
        type: Sequelize.STRING,
        references: {
          model: 'StatusActivities',
          key: 'documentId'
        },
        allowNull: true,  // Cho phép null
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};