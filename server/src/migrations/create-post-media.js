'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('post_medias', {
      post_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Posts',  // Tên bảng Posts
          key: 'id',       // Cột khóa chính trong bảng Posts
        },
        onUpdate: 'CASCADE',  // Cập nhật khi có thay đổi trong bảng Posts
        onDelete: 'CASCADE',  // Xóa khi xóa bài viết
      },
      media_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Medias',  // Tên bảng Medias
          key: 'id',        // Cột khóa chính trong bảng Medias
        },
        onUpdate: 'CASCADE',  // Cập nhật khi có thay đổi trong bảng Medias
        onDelete: 'CASCADE',  // Xóa khi xóa media
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

    // Tạo chỉ mục duy nhất cho cặp (post_id, media_id)
    await queryInterface.addIndex('post_medias', ['post_id', 'media_id'], {
      unique: true,  // Đảm bảo mỗi (post_id, media_id) là duy nhất
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('post_medias');
  }
};
