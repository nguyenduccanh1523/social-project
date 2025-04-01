'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('userSocials', {
      documentId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
      },
      accountUrl: {
        type: Sequelize.STRING,
        allowNull: false,  // URL tài khoản xã hội là bắt buộc
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',  // Tên bảng Users
          key: 'documentId'  // Trường 'documentId' trong bảng Users
        },
        onUpdate: 'CASCADE',  // Cập nhật user_id khi có thay đổi trong bảng Users
        onDelete: 'CASCADE',  // Xóa userSocial khi xóa User
      },
      social_id: {
        type: Sequelize.STRING,  // Sử dụng chuỗi UUID để liên kết với Social
        allowNull: false,
        references: {
          model: 'Socials',  // Tên bảng Social
          key: 'documentId'  // Trường 'documentId' trong bảng Social
        },
        onUpdate: 'CASCADE',  // Cập nhật social_id khi có thay đổi trong bảng Social
        onDelete: 'CASCADE',  // Xóa userSocial khi xóa Social
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
    await queryInterface.dropTable('userSocials');
  }
};
