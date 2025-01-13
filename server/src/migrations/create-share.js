'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Shares', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,  // Tự động tăng giá trị ID
      },
      post_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Posts',  // Tên bảng Posts
          key: 'id',       // Cột khóa chính trong bảng Posts
        },
        onUpdate: 'CASCADE',  // Cập nhật khi có thay đổi trong bảng Posts
        onDelete: 'CASCADE',  // Xóa khi xóa bài viết
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',  // Tên bảng Users
          key: 'id',       // Cột khóa chính trong bảng Users
        },
        onUpdate: 'CASCADE',  // Cập nhật khi có thay đổi trong bảng Users
        onDelete: 'CASCADE',  // Xóa khi xóa người dùng
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,  // Tự động gán thời gian tạo
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,  // Tự động gán thời gian cập nhật
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,  // Trường này có thể là null
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Shares');
  }
};
