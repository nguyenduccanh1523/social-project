'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class EventMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một EventMember thuộc về một Event
      EventMember.belongsTo(models.Event, {
        foreignKey: 'event_id',
        targetKey: 'documentId',
        as: 'event'
      });
      
      // Một EventMember thuộc về một User
      EventMember.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'documentId',
        as: 'user'
      });
    }
  }
  EventMember.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    event_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'documentId'
      }
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'interested',
      comment: 'going, interested, not going',
      validate: {
        isIn: [['going', 'interested', 'not going']]
      }
    }
  }, {
    sequelize,
    modelName: 'EventMember',
    paranoid: true, // Sử dụng soft delete với trường deletedAt
    indexes: [
      {
        unique: true,
        fields: ['event_id', 'user_id']
      }
    ]
  });
  return EventMember;
}; 