'use strict';
/** @type {import('sequelize-cli').Migration} */
import { v4 as uuidv4 } from 'uuid';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EventMembers', {
      documentId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: uuidv4,
      },
      event_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Events',
          key: 'documentId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'documentId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'interested',
        comment: 'going, interested, not going'
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
    
    // Tạo unique constraint cho cặp event_id, user_id
    await queryInterface.addConstraint('EventMembers', {
      fields: ['event_id', 'user_id'],
      type: 'unique',
      name: 'unique_event_user_member'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('EventMembers');
  }
}; 