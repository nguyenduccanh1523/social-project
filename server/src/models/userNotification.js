'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class UserNotification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một UserNotification thuộc về một User
      UserNotification.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'documentId',
        as: 'user'
      });
      
      // Một UserNotification thuộc về một Notification
      UserNotification.belongsTo(models.Notification, {
        foreignKey: 'notification_id',
        targetKey: 'documentId',
        as: 'notification'
      });
    }
  }
  UserNotification.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    },
    notification_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Notifications',
        key: 'documentId'
      }
    }
  }, {
    sequelize,
    modelName: 'UserNotification',
    tableName: 'usernotifications',
    freezeTableName: true,
    paranoid: true, // Sử dụng soft delete với trường deletedAt
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'notification_id']
      }
    ]
  });
  return UserNotification;
}; 