'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class EventRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một EventRequest có một trạng thái
      EventRequest.belongsTo(models.StatusAction, {
        foreignKey: 'request_status',
        targetKey: 'documentId',
        as: 'status'
      });
      
      // Một EventRequest thuộc về một Event
      EventRequest.belongsTo(models.Event, {
        foreignKey: 'event_id',
        targetKey: 'documentId',
        as: 'event'
      });
      
      // Một EventRequest được tạo bởi một User
      EventRequest.belongsTo(models.User, {
        foreignKey: 'user_request',
        targetKey: 'documentId',
        as: 'user'
      });
    }
  }
  EventRequest.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    request_status: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'StatusActions',
        key: 'documentId'
      }
    },
    event_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'documentId'
      }
    },
    user_request: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    }
  }, {
    sequelize,
    modelName: 'EventRequest',
    tableName: 'eventrequests',
    freezeTableName: true,
    paranoid: true, // Sử dụng soft delete với trường deletedAt
    indexes: [
      {
        unique: true,
        fields: ['event_id', 'user_request']
      }
    ]
  });
  return EventRequest;
}; 