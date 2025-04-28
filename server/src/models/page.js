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
      
      // Một Page có ảnh đại diện (Media)
      Page.belongsTo(models.Media, {
        foreignKey: 'profile_picture',
        targetKey: 'documentId',
        as: 'profileImage'
      });
      
      // Một Page có ảnh bìa (Media)
      Page.belongsTo(models.Media, {
        foreignKey: 'cover_picture',
        targetKey: 'documentId',
        as: 'coverImage'
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
      
      // Một Page có nhiều Post
      Page.hasMany(models.Post, {
        foreignKey: 'page_id',
        sourceKey: 'documentId',
        as: 'posts'
      });
      
      // Một Page có nhiều UserSocial
      Page.hasMany(models.userSocial, {
        foreignKey: 'page_id',
        sourceKey: 'documentId',
        as: 'socials'
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
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Medias',
        key: 'documentId'
      }
    },
    cover_picture: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Medias',
        key: 'documentId'
      }
    },
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
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Page',
    paranoid: true // Sử dụng soft delete với trường deletedAt
  });
  return Page;
}; 