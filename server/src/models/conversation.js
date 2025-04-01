'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một cuộc trò chuyện được tạo bởi một User
      Conversation.belongsTo(models.User, {
        foreignKey: 'conversation_created_by',
        targetKey: 'documentId',
        as: 'creator'
      });

      // Một cuộc trò chuyện 1-1 với một User
      Conversation.belongsTo(models.User, {
        foreignKey: 'user_chated_with',
        targetKey: 'documentId',
        as: 'participant'
      });

      // Một cuộc trò chuyện có thể có một ảnh nhóm
      Conversation.belongsTo(models.Media, {
        foreignKey: 'image_group_chat',
        targetKey: 'documentId',
        as: 'groupImage'
      });

      // Một cuộc trò chuyện có nhiều người tham gia
      Conversation.hasMany(models.ConversationParticipant, {
        foreignKey: 'conversation_id',
        sourceKey: 'documentId',
        as: 'participants'
      });

      // Một cuộc trò chuyện có nhiều tin nhắn
      Conversation.hasMany(models.Message, {
        foreignKey: 'conversation_id',
        sourceKey: 'documentId',
        as: 'messages'
      });
    }
  }
  Conversation.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    is_group_chat: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    conversation_created_by: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    },
    user_chated_with: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    },
    image_group_chat: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Medias',
        key: 'documentId'
      }
    }
  }, {
    sequelize,
    modelName: 'Conversation',
    paranoid: true // Sử dụng soft delete với trường deletedAt
  });
  return Conversation;
}; 