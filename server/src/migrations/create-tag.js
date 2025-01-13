'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tags', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,  // Tự động tăng giá trị ID
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,  // Không cho phép giá trị null
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true,  // Cho phép giá trị null
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
    await queryInterface.dropTable('Tags');
  }
};
