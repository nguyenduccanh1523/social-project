'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NoticeType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một NoticeType có nhiều Notification
      NoticeType.hasMany(models.Notification, {
        foreignKey: 'notice_type_id',
        sourceKey: 'documentId',
        as: 'notifications'
      });
      
      // Một NoticeType có nhiều NotificationSetting
      NoticeType.hasMany(models.NotificationSetting, {
        foreignKey: 'notice_type_id',
        sourceKey: 'documentId',
        as: 'notificationSettings'
      });
    }
  }
  NoticeType.init({
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
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'NoticeType',
    paranoid: true // Sử dụng soft delete với trường deletedAt
  });
  return NoticeType;
}; 