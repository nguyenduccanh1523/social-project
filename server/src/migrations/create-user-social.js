'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('userSocials', {
      id: {
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
          key: 'id'  // Trường 'id' trong bảng Users
        },
        onUpdate: 'CASCADE',  // Cập nhật user_id khi có thay đổi trong bảng Users
        onDelete: 'CASCADE',  // Xóa userSocial khi xóa User
      },
      social_id: {
        type: Sequelize.STRING,  // Sử dụng chuỗi UUID để liên kết với Social
        allowNull: false,
        references: {
          model: 'Social',  // Tên bảng Social
          key: 'id'  // Trường 'id' trong bảng Social
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
