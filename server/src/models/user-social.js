'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class userSocial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
       // Một userSocial liên kết với một User
      userSocial.belongsTo(models.User, {
        foreignKey: 'user_id',  // Cột trong bảng userSocial
        targetKey: 'documentId',
        as: 'user'  // Alias để truy cập User từ userSocial
      });

      // Một userSocial liên kết với một Social
      userSocial.belongsTo(models.Social, {
        foreignKey: 'social_id',  // Cột trong bảng userSocial
        targetKey: 'documentId',
        as: 'social'  // Alias để truy cập Social từ userSocial
      });
      
      // Một userSocial liên kết với một Page
      userSocial.belongsTo(models.Page, {
        foreignKey: 'page_id',
        targetKey: 'documentId',
        as: 'page'
      });
    }
  }
  userSocial.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    accountUrl: DataTypes.STRING,
    user_id: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'documentId',
        },
    },
    social_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'Socials',
          key: 'documentId',
        },
    },
    page_id: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: 'Pages',
          key: 'documentId',
        },
    }
  }, {
    sequelize,
    modelName: 'userSocial',
  });
  return userSocial;
};