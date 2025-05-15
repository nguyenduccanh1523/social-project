'use strict';
/** @type {import('sequelize-cli').Migration} */
import { v4 as uuidv4 } from 'uuid';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PostTags', {
      documentId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: uuidv4,
      },
      page_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'Pages',
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
      tag_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Tags',
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

    // Tạo index duy nhất cho cặp post_id, tag_id
    await queryInterface.addIndex('PostTags', ['post_id', 'tag_id'], {
      unique: true,
      where: {
        post_id: {
          [Sequelize.Op.ne]: null
        }
      }
    });
    
    // Tạo index duy nhất cho cặp document_share_id, tag_id
    await queryInterface.addIndex('PostTags', ['document_share_id', 'tag_id'], {
      unique: true,
      where: {
        document_share_id: {
          [Sequelize.Op.ne]: null
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PostTags');
  }
};
