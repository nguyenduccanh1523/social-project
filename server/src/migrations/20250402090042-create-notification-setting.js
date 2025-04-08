'use strict';
/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('NotificationSettings', {
      documentId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: uuidv4,
      },
      is_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
      group_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'Groups',
          key: 'documentId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      notice_type_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'NoticeTypes',
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
    
    // Tạo unique constraint cho các trường user_id, notice_type_id
    await queryInterface.addConstraint('NotificationSettings', {
      fields: ['user_id', 'notice_type_id'],
      type: 'unique',
      name: 'unique_user_notice_type_setting',
      where: {
        group_id: null
      }
    });
    
    await queryInterface.addConstraint('NotificationSettings', {
      fields: ['user_id', 'group_id', 'notice_type_id'],
      type: 'unique',
      name: 'unique_user_group_notice_type_setting',
      where: {
        group_id: {
          [Sequelize.Op.ne]: null
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('NotificationSettings');
  }
}; 