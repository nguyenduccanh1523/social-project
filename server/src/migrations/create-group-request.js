'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('group_requests', {
      documentId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,  // Tự động tăng giá trị ID
      },
      group_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Groups',  // Tên bảng Groups
          key: 'documentId',        // Khóa chính trong bảng Groups
        },
        onUpdate: 'CASCADE',  // Cập nhật group_id nếu có thay đổi trong bảng Groups
        onDelete: 'CASCADE',  // Xóa yêu cầu khi nhóm bị xóa
      },
      user_request: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',  // Tên bảng Users
          key: 'documentId',       // Khóa chính trong bảng Users
        },
        onUpdate: 'CASCADE',  // Cập nhật user_id nếu có thay đổi trong bảng Users
        onDelete: 'CASCADE',  // Xóa yêu cầu khi người dùng bị xóa
      },
      status_action_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'StatusActions',
          key: 'documentId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Tự động gán thời gian tạo
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Tự động gán thời gian cập nhật
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true, // Trường này có thể là null
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
    }).then(() => {
      // Tạo index sau khi bảng đã được tạo
      return queryInterface.addIndex('group_requests', ['group_id', 'user_request'], {
        unique: true
      });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('group_requests');
  }
};
