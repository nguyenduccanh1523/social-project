'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('group_members', {
      documentId: {
        type: Sequelize.STRING,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      group_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Groups',
          key: 'documentId',
        },
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'documentId',
        },
      },
      joined_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('group_members');
  }
};
