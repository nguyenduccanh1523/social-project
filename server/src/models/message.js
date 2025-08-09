'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một tin nhắn được gửi bởi một User
      Message.belongsTo(models.User, {
        foreignKey: 'sender_id',
        targetKey: 'documentId',
        as: 'sender'
      });

      // Một tin nhắn được gửi đến một User
      Message.belongsTo(models.User, {
        foreignKey: 'receiver_id',
        targetKey: 'documentId',
        as: 'receiver'
      });

      // Một tin nhắn thuộc về một cuộc trò chuyện
      Message.belongsTo(models.Conversation, {
        foreignKey: 'conversation_id',
        targetKey: 'documentId',
        as: 'conversation'
      });

      // Một tin nhắn có thể có một media
      Message.belongsTo(models.Media, {
        foreignKey: 'media_id',
        targetKey: 'documentId',
        as: 'media'
      });
    }
  }
  Message.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    sender_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    },
    receiver_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    conversation_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Conversations',
        key: 'documentId'
      }
    },
    media_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Medias',
        key: 'documentId'
      }
    }
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'messages',
    freezeTableName: true,
    paranoid: true // Sử dụng soft delete với trường deletedAt
  });
  return Message;
}; 