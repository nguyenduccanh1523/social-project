'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      documentId: {
        type: Sequelize.STRING,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      fullname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      date_of_birth: {
        type: Sequelize.DATE,
        allowNull: false
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Roles',
          key: 'documentId'
        }
      },
      status_id: {
        type: Sequelize.STRING,
        references: {
          model: 'StatusActivities',
          key: 'documentId'
        }
      },
      nation_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'Nations',
          key: 'documentId'
        }
      },
      last_active: {
        type: Sequelize.DATE,
        allowNull: true
      },
      reset_password_token: {
        type: Sequelize.STRING,
        allowNull: true
      },
      reset_password_expires: {
        type: Sequelize.DATE,
        allowNull: true
      },
      avatar_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'Medias',
          key: 'documentId'
        }
      },
      cover_photo_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'Medias',
          key: 'documentId'
        }
      },
      is_online: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_blocked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      about: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
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
    await queryInterface.dropTable('Users');
  }
}; 