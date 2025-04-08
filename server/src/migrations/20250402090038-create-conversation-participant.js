'use strict';
/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ConversationParticipants', {
      documentId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: uuidv4,
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      conversation_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Conversations',
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

    // Tạo chỉ mục duy nhất cho cặp (conversation_id, user_id)
    await queryInterface.addIndex('ConversationParticipants', ['conversation_id', 'user_id'], {
      unique: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ConversationParticipants');
  }
}; 