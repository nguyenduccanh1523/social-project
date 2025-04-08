'use strict';
/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reactions', {
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
      post_id: {
        type: Sequelize.STRING,
        allowNull: true, // Có thể null nếu reaction cho comment
        references: {
          model: 'Posts',
          key: 'documentId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      comment_id: {
        type: Sequelize.STRING,
        allowNull: true, // Có thể null nếu reaction cho post
        references: {
          model: 'Comments',
          key: 'documentId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      reaction_type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'like',
        comment: 'like, love, wow, etc.'
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

    // Tạo unique constraint để đảm bảo một người chỉ có thể thả một loại reaction trên một post/comment
    await queryInterface.addConstraint('Reactions', {
      fields: ['user_id', 'post_id'],
      type: 'unique',
      name: 'unique_user_post_reaction',
      where: {
        post_id: {
          [Sequelize.Op.ne]: null
        }
      }
    });

    await queryInterface.addConstraint('Reactions', {
      fields: ['user_id', 'comment_id'],
      type: 'unique',
      name: 'unique_user_comment_reaction',
      where: {
        comment_id: {
          [Sequelize.Op.ne]: null
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reactions');
  }
}; 