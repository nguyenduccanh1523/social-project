"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Medias", {
      documentId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
      },
      file_path: {
        type: Sequelize.STRING(255),
        allowNull: false, // Không cho phép giá trị null
      },
      file_type: {
        type: Sequelize.STRING(50),
        allowNull: false, // Không cho phép giá trị null
      },
      file_size: {
        type: Sequelize.DOUBLE,
        allowNull: false, // Không cho phép giá trị null
      },
      type_id: {
        type: Sequelize.STRING,
        allowNull: true, // Cho phép null
        references: {
          model: "Types",
          key: "documentId",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW, // Tự động gán thời gian tạo
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW, // Tự động gán thời gian cập nhật
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true, // Trường này có thể là null
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Medias");
  },
};
