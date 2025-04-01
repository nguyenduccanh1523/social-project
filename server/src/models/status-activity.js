'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StatusActivity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Mối quan hệ giữa StatusActivity và User: Một StatusActivity có thể có nhiều User
      StatusActivity.hasMany(models.User, {
        foreignKey: 'status_activity_id',
        sourceKey: 'documentId',
        as: 'users'
      });
    }
  }
  StatusActivity.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'StatusActivity',
    paranoid: true // Để bật soft delete với trường deletedAt
  });
  return StatusActivity;
}; 