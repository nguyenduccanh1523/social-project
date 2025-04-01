'use strict';
/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MarkPosts', {
      documentId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: uuidv4,
      },
      document_share_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'DocumentShares',
          key: 'documentId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      post_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'Posts',
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
    
    // Tạo unique constraint cho cặp user_id, post_id
    await queryInterface.addConstraint('MarkPosts', {
      fields: ['user_id', 'post_id'],
      type: 'unique',
      name: 'unique_user_post_mark',
      where: {
        post_id: {
          [Sequelize.Op.ne]: null
        }
      }
    });
    
    // Tạo unique constraint cho cặp user_id, document_share_id
    await queryInterface.addConstraint('MarkPosts', {
      fields: ['user_id', 'document_share_id'],
      type: 'unique',
      name: 'unique_user_document_mark',
      where: {
        document_share_id: {
          [Sequelize.Op.ne]: null
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MarkPosts');
  }
}; 