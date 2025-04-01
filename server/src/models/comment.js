'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Mối quan hệ giữa Comment và User: Một Comment thuộc về một User
      Comment.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'documentId',
        as: 'user'
      });

      // Mối quan hệ giữa Comment và Post: Một Comment thuộc về một Post
      Comment.belongsTo(models.Post, {
        foreignKey: 'post_id',
        targetKey: 'documentId',
        as: 'post'
      });

      // Mối quan hệ tự tham chiếu: Một Comment có thể có parent là một Comment khác (cho replies)
      Comment.belongsTo(models.Comment, {
        foreignKey: 'parent_id',
        targetKey: 'documentId',
        as: 'parent'
      });

      // Mối quan hệ tự tham chiếu: Một Comment có thể có nhiều Comment con (replies)
      Comment.hasMany(models.Comment, {
        foreignKey: 'parent_id',
        sourceKey: 'documentId',
        as: 'replies'
      });
    }
  }

  Comment.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    post_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    parent_id: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Comment',
    paranoid: true // Sử dụng soft delete với trường deletedAt
  });

  return Comment;
};
