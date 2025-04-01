'use strict';
/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Stories', {
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
      media_id: {
        type: Sequelize.STRING,
        allowNull: true, // Cho phép null nếu là text story
        references: {
          model: 'Medias',
          key: 'documentId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      background: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      story_type: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: 'image, video, text'
      },
      status_story: {
        type: Sequelize.STRING(20),
        defaultValue: 'active',
        comment: 'active, expired'
      },
      type_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Types',
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
      expired_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW() + INTERVAL \'24 HOURS\''),
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
    await queryInterface.dropTable('Stories');
  }
}; 