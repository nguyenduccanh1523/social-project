'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một Notification thuộc về một NoticeType
      Notification.belongsTo(models.NoticeType, {
        foreignKey: 'notice_type_id',
        targetKey: 'documentId',
        as: 'noticeType'
      });
      
      // Một Notification có nhiều NotificationCreated
      Notification.hasMany(models.NotificationCreated, {
        foreignKey: 'notification_id',
        sourceKey: 'documentId',
        as: 'creators'
      });
      
      // Một Notification có nhiều UserNotification
      Notification.hasMany(models.UserNotification, {
        foreignKey: 'notification_id',
        sourceKey: 'documentId',
        as: 'userNotifications'
      });
      
      // Mối quan hệ nhiều-nhiều với Users thông qua UserNotification
      Notification.belongsToMany(models.User, {
        through: models.UserNotification,
        foreignKey: 'notification_id',
        otherKey: 'user_id',
        as: 'users'
      });
    }
  }
  Notification.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    link: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_global: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    notice_type_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'NoticeTypes',
        key: 'documentId'
      }
    }
  }, {
    sequelize,
    modelName: 'Notification',
    paranoid: true // Sử dụng soft delete với trường deletedAt
  });
  return Notification;
}; 