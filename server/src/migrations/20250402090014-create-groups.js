'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Groups', {
      documentId: {
        type: Sequelize.STRING,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      group_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      admin_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'documentId'
        }
      },
      group_image: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'Medias',
          key: 'documentId'
        }
      },
      type_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'Types',
          key: 'documentId'
        }
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
    await queryInterface.dropTable('Groups');
  }
};
