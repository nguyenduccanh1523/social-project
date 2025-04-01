'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một friend record thuộc về một User (người gửi yêu cầu kết bạn)
      Friend.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'documentId',
        as: 'user'
      });

      // Một friend record thuộc về một User (người nhận yêu cầu kết bạn)
      Friend.belongsTo(models.User, {
        foreignKey: 'friend_id',
        targetKey: 'documentId',
        as: 'friend'
      });

      // Một friend record thuộc về một StatusAction (trạng thái của yêu cầu kết bạn)
      Friend.belongsTo(models.StatusAction, {
        foreignKey: 'status_action_id',
        targetKey: 'documentId',
        as: 'status'
      });
    }
  }
  Friend.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    },
    friend_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    },
    status_action_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'StatusActions',
        key: 'documentId'
      }
    }
  }, {
    sequelize,
    modelName: 'Friend',
    paranoid: true, // Sử dụng soft delete với trường deletedAt
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'friend_id']
      }
    ]
  });
  return Friend;
}; 