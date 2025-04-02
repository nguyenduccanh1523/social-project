'use strict';
/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ViewStories', {
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
      story_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Stories',
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
        allowNull: false,
        type: Sequelize.DATE
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

    // Tạo unique constraint để đảm bảo mỗi user chỉ xem một story một lần
    await queryInterface.addConstraint('ViewStories', {
      fields: ['user_id', 'story_id'],
      type: 'unique',
      name: 'unique_user_story_view'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ViewStories');
  }
}; 