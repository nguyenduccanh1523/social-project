'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Groups', {
      documentId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING, // ID kiểu chuỗi (UUID)
        defaultValue: Sequelize.UUIDV4,  // Tạo giá trị mặc định UUID
      },
      groupName: {
        type: Sequelize.STRING,
        allowNull: false,  // groupName là bắt buộc
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,   // description là tùy chọn
      },
      admin_id: {
        type: Sequelize.STRING,
        allowNull: false,  // admin_id là bắt buộc
        references: {
          model: 'Users',  // Tên bảng Users
          key: 'documentId',       // Trường 'documentId' trong bảng Users
        },
        onUpdate: 'CASCADE',  // Cập nhật admin_id khi có thay đổi trong bảng Users
        onDelete: 'CASCADE',  // Xóa group khi xóa User
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
    await queryInterface.dropTable('Groups');
  }
};
