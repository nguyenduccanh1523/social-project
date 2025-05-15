'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class EventInvitation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một EventInvitation có một trạng thái
      EventInvitation.belongsTo(models.StatusAction, {
        foreignKey: 'invitation_status',
        targetKey: 'documentId',
        as: 'status'
      });
      
      // Một EventInvitation thuộc về một Event
      EventInvitation.belongsTo(models.Event, {
        foreignKey: 'event_id',
        targetKey: 'documentId',
        as: 'event'
      });
      
      // Một EventInvitation được gửi bởi một User
      EventInvitation.belongsTo(models.User, {
        foreignKey: 'invited_by',
        targetKey: 'documentId',
        as: 'sender'
      });
      
      // Một EventInvitation được gửi đến một User
      EventInvitation.belongsTo(models.User, {
        foreignKey: 'invited_to',
        targetKey: 'documentId',
        as: 'receiver'
      });
    }
  }
  EventInvitation.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    invitation_status: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'StatusActions',
        key: 'documentId'
      }
    },
    responded_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    event_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'documentId'
      }
    },
    invited_by: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    },
    invited_to: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    }
  }, {
    sequelize,
    modelName: 'EventInvitation',
    paranoid: true, // Sử dụng soft delete với trường deletedAt
    indexes: [
      {
        unique: true,
        fields: ['event_id', 'invited_to']
      }
    ]
  });
  return EventInvitation;
}; 