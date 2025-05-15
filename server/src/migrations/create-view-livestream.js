'use strict';
/** @type {import('sequelize-cli').Migration} */
import { v4 as uuidv4 } from 'uuid';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ViewLivestreams', {
      documentId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: uuidv4,
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
      livestream_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Livestreams',
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
      expired_at: {
        type: Sequelize.DATE,
        allowNull: true,
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
    
    // Tạo unique constraint cho cặp user_id, livestream_id
    await queryInterface.addConstraint('ViewLivestreams', {
      fields: ['user_id', 'livestream_id'],
      type: 'unique',
      name: 'unique_user_livestream_view'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ViewLivestreams');
  }
}; 