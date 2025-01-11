'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('group_members', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
      },
      group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Groups',  // Tên bảng Groups
          key: 'id',        // Cột khóa chính trong bảng Groups
        },
        onUpdate: 'CASCADE',  // Cập nhật group_id nếu có thay đổi trong bảng Groups
        onDelete: 'CASCADE',  // Xóa tất cả các bản ghi trong bảng group_members khi xóa Group
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',  // Tên bảng Users
          key: 'id',       // Cột khóa chính trong bảng Users
        },
        onUpdate: 'CASCADE',  // Cập nhật user_id nếu có thay đổi trong bảng Users
        onDelete: 'CASCADE',  // Xóa tất cả các bản ghi trong bảng group_members khi xóa User
      },
      joined_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,  // Tự động gán thời gian hiện tại khi người dùng tham gia nhóm
      },
      // Chỉ mục để đảm bảo mỗi cặp (group_id, user_id) là duy nhất
      indexes: [
        {
          unique: true,
          fields: ['group_id', 'user_id'],
        },
      ],
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
    await queryInterface.dropTable('group_members');
  }
};
