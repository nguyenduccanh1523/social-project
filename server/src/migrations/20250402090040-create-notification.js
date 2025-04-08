'use strict';
/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Notifications', {
      documentId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: uuidv4,
      },
      title: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      link: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_global: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      notice_type_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'NoticeTypes',
          key: 'documentId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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
    await queryInterface.dropTable('Notifications');
  }
}; 