'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('group_invitations', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,  // Tự động tăng giá trị ID
      },
      invitation_status: {
        type: Sequelize.STRING,
        defaultValue: 'pending', // Trạng thái mặc định là 'pending'
      },
      responded_at: {
        type: Sequelize.DATE,
        allowNull: true,  // Thời gian phản hồi có thể là null
      },
      group_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Groups',  // Tên bảng Groups
          key: 'id',        // Cột khóa chính trong bảng Groups
        },
        onUpdate: 'CASCADE',  // Cập nhật group_id nếu có thay đổi trong bảng Groups
        onDelete: 'CASCADE',  // Xóa tất cả các lời mời khi nhóm bị xóa
      },
      invited_by: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',   // Tên bảng Users
          key: 'id',        // Cột khóa chính trong bảng Users
        },
        onUpdate: 'CASCADE',  // Cập nhật invited_by nếu có thay đổi trong bảng Users
        onDelete: 'CASCADE',  // Xóa tất cả các lời mời khi người dùng bị xóa
      },
      invited_to: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',   // Tên bảng Users
          key: 'id',        // Cột khóa chính trong bảng Users
        },
        onUpdate: 'CASCADE',  // Cập nhật invited_to nếu có thay đổi trong bảng Users
        onDelete: 'CASCADE',  // Xóa tất cả các lời mời khi người dùng bị xóa
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  // Tự động gán thời gian tạo
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  // Tự động gán thời gian cập nhật
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,  // Trường này có thể là null
      },
      // Chỉ mục để đảm bảo không có lời mời trùng lặp cho mỗi người dùng trong mỗi nhóm
      indexes: [
        {
          unique: true,
          fields: ['group_id', 'invited_by', 'invited_to'],  // Đảm bảo mỗi lời mời chỉ tồn tại một lần cho một nhóm và người nhận
        },
      ],
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('group_invitations');
  }
};
