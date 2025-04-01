'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_requests', {
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
      user_id: {
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
      // Chỉ mục để đảm bảo không có yêu cầu trùng lặp cho mỗi user trong mỗi group
      indexes: [
        {
          unique: true,
          fields: ['group_id', 'user_id'], // Cặp group_id và user_id là duy nhất
        },
      ],
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_requests');
  }
};
