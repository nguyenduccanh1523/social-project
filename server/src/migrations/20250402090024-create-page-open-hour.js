'use strict';
/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PageOpenHours', {
      documentId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: uuidv4,
      },
      page_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Pages',
          key: 'documentId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      open_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      close_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      day_of_week: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(50),
        defaultValue: 'open',
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
    
    // Tạo unique constraint cho cặp page_id, day_of_week
    await queryInterface.addConstraint('PageOpenHours', {
      fields: ['page_id', 'day_of_week'],
      type: 'unique',
      name: 'unique_page_day_schedule'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PageOpenHours');
  }
}; 