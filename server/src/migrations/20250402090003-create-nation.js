'use strict';
/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Nations', {
      documentId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: uuidv4,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      niceName: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      iso: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      phoneCode: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Nations');
  }
}; 