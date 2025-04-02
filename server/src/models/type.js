'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Quan hệ với Post
      Type.hasMany(models.Post, {
        foreignKey: 'type_id',
        sourceKey: 'documentId',
        as: 'posts'
      });
      
      // Quan hệ với Story
      Type.hasMany(models.Story, {
        foreignKey: 'type_id',
        sourceKey: 'documentId',
        as: 'stories'
      });
      
      // Quan hệ với Group
      Type.hasMany(models.Group, {
        foreignKey: 'type_id',
        sourceKey: 'documentId',
        as: 'groups'
      });
      
      // Quan hệ với StatusActivity
      Type.hasMany(models.StatusActivity, {
        foreignKey: 'type_id',
        sourceKey: 'documentId',
        as: 'statusActivities'
      });
      
      // Quan hệ với Media
      Type.hasMany(models.Media, {
        foreignKey: 'type_id',
        sourceKey: 'documentId',
        as: 'medias'
      });
    }
  }
  Type.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Type',
    paranoid: true // Để bật soft delete với trường deletedAt
  });
  return Type;
}; 