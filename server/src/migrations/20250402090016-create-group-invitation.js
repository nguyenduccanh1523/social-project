'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('group_invitations', {
      documentId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,  // Tự động tăng giá trị ID
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
      responded_at: {
        type: Sequelize.DATE,
        allowNull: true,  // Thời gian phản hồi có thể là null
      },
      group_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Groups',  // Tên bảng Groups
          key: 'documentId',        // Cột khóa chính trong bảng Groups
        },
        onUpdate: 'CASCADE',  // Cập nhật group_id nếu có thay đổi trong bảng Groups
        onDelete: 'CASCADE',  // Xóa tất cả các lời mời khi nhóm bị xóa
      },
      invited_by: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',   // Tên bảng Users
          key: 'documentId',        // Cột khóa chính trong bảng Users
        },
        onUpdate: 'CASCADE',  // Cập nhật invited_by nếu có thay đổi trong bảng Users
        onDelete: 'CASCADE',  // Xóa tất cả các lời mời khi người dùng bị xóa
      },
      invited_to: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',   // Tên bảng Users
          key: 'documentId',        // Cột khóa chính trong bảng Users
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
      return queryInterface.addIndex('group_invitations', ['group_id', 'invited_by', 'invited_to'], {
        unique: true
      });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('group_invitations');
  }
};
