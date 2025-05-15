'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class NotificationCreated extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một NotificationCreated thuộc về một Notification
      NotificationCreated.belongsTo(models.Notification, {
        foreignKey: 'notification_id',
        targetKey: 'documentId',
        as: 'notification'
      });
      
      // Một NotificationCreated có thể được tạo bởi một User
      NotificationCreated.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'documentId',
        as: 'user'
      });
      
      // Một NotificationCreated có thể được tạo bởi một Page
      NotificationCreated.belongsTo(models.Page, {
        foreignKey: 'page_id',
        targetKey: 'documentId',
        as: 'page'
      });
      
      // Một NotificationCreated có thể được tạo bởi một Group
      NotificationCreated.belongsTo(models.Group, {
        foreignKey: 'group_id',
        targetKey: 'documentId',
        as: 'group'
      });
      
      // Một NotificationCreated có thể được tạo bởi một Event
      NotificationCreated.belongsTo(models.Event, {
        foreignKey: 'event_id',
        targetKey: 'documentId',
        as: 'event'
      });
    }
  }
  NotificationCreated.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    notification_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Notifications',
        key: 'documentId'
      }
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    },
    page_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Pages',
        key: 'documentId'
      }
    },
    group_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Groups',
        key: 'documentId'
      }
    },
    event_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Events',
        key: 'documentId'
      }
    }
  }, {
    sequelize,
    modelName: 'NotificationCreated',
    paranoid: true // Sử dụng soft delete với trường deletedAt
  });
  return NotificationCreated;
}; 