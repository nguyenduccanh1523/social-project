"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Posts", {
      documentId: {
        type: Sequelize.STRING,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Users",
          key: "documentId",
        },
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      group_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: "Groups",
          key: "documentId",
        },
      },
      page_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: "Pages",
          key: "documentId",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      type_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: "Types",
          key: "documentId",
        },
      },
      event_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: "Events",
          key: "documentId",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "public",
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Posts");
  },
};
