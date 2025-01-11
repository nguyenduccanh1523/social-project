'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Socials', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING, // ID kiểu chuỗi (UUID)
        defaultValue: Sequelize.UUIDV4,  // Tạo UUID ngẫu nhiên làm giá trị mặc định
      },
      platform: {
        type: Sequelize.STRING,
        allowNull: false,  // Platform là bắt buộc
      },
      iconUrl: {
        type: Sequelize.STRING,
        allowNull: true,   // Icon là tùy chọn
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
    await queryInterface.dropTable('Socials');
  }
};
