'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConversationParticipant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một ConversationParticipant thuộc về một Conversation
      ConversationParticipant.belongsTo(models.Conversation, {
        foreignKey: 'conversation_id',
        targetKey: 'documentId',
        as: 'conversation'
      });

      // Một ConversationParticipant thuộc về một User
      ConversationParticipant.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'documentId',
        as: 'user'
      });
    }
  }
  ConversationParticipant.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    }
  }, {
    sequelize,
    modelName: 'ConversationParticipant',
    paranoid: true // Sử dụng soft delete với trường deletedAt
  });
  return ConversationParticipant;
}; 