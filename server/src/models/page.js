'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Page extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một Page thuộc về một Nation
      Page.belongsTo(models.Nation, {
        foreignKey: 'lives_in',
        targetKey: 'documentId',
        as: 'nation'
      });
      
      // Một Page được tạo bởi một User
      Page.belongsTo(models.User, {
        foreignKey: 'author',
        targetKey: 'documentId',
        as: 'creator'
      });
      
      // Một Page có nhiều Post Tags
      Page.hasMany(models.PostTag, {
        foreignKey: 'page_id',
        sourceKey: 'documentId',
        as: 'postTags'
      });
      
      // Một Page có thể có nhiều NotificationCreated
      Page.hasMany(models.NotificationCreated, {
        foreignKey: 'page_id',
        sourceKey: 'documentId',
        as: 'notifications'
      });
      
      // Một Page có nhiều PageMember
      Page.hasMany(models.PageMember, {
        foreignKey: 'page_id',
        sourceKey: 'documentId',
        as: 'members'
      });
      
      // Một Page có nhiều PageOpenHour
      Page.hasMany(models.PageOpenHour, {
        foreignKey: 'page_id',
        sourceKey: 'documentId',
        as: 'openHours'
      });
    }
  }
  Page.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    page_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    intro: DataTypes.TEXT,
    about: DataTypes.TEXT,
    profile_picture: DataTypes.STRING(255),
    cover_picture: DataTypes.STRING(255),
    email: DataTypes.TEXT,
    phone: DataTypes.TEXT,
    lives_in: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Nations',
        key: 'documentId'
      }
    },
    rate: DataTypes.TEXT,
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    }
  }, {
    sequelize,
    modelName: 'Page',
    paranoid: true // Sử dụng soft delete với trường deletedAt
  });
  return Page;
}; 