'use strict';
/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EventInvitations', {
      documentId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: uuidv4,
      },
      invitation_status: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'StatusActions',
          key: 'documentId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      responded_at: {
        type: Sequelize.DATE,
        allowNull: true,
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
      invited_by: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'documentId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      invited_to: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'documentId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    
    // Tạo unique constraint cho cặp event_id, invited_to
    await queryInterface.addConstraint('EventInvitations', {
      fields: ['event_id', 'invited_to'],
      type: 'unique',
      name: 'unique_event_user_invitation'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('EventInvitations');
  }
}; 