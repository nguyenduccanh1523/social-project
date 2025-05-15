'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class PostFriend extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một PostFriend thuộc về một Post
      PostFriend.belongsTo(models.Post, {
        foreignKey: 'post_id',
        targetKey: 'documentId',
        as: 'post'
      });
      
      // Một PostFriend thuộc về một User
      PostFriend.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'documentId',
        as: 'user'
      });
    }
  }
  PostFriend.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    post_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Posts',
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
    modelName: 'PostFriend',
    paranoid: true, // Sử dụng soft delete với trường deletedAt
    indexes: [
      {
        unique: true,
        fields: ['post_id', 'user_id']
      }
    ]
  });
  return PostFriend;
}; 