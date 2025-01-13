'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Medias', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
      },
      file_path: {
        type: Sequelize.STRING(255),
        allowNull: false,  // Không cho phép giá trị null
      },
      file_type: {
        type: Sequelize.STRING(50),
        allowNull: false,  // Không cho phép giá trị null
      },
      file_size: {
        type: Sequelize.DOUBLE,
        allowNull: false,  // Không cho phép giá trị null
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
    await queryInterface.dropTable('Medias');
  }
};
