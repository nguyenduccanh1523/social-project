'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PostFriends', {
      documentId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
      },
      post_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'Posts',
          key: 'documentId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'documentId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    // Tạo unique constraint cho post_id và user_id
    await queryInterface.addConstraint('PostFriends', {
      fields: ['post_id', 'user_id'],
      type: 'unique',
      name: 'unique_post_user_friend'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PostFriends');
  }
}; 