'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Reaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một reaction được tạo bởi một User
      Reaction.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'documentId',
        as: 'user'
      });

      // Một reaction có thể thuộc về một Post
      Reaction.belongsTo(models.Post, {
        foreignKey: 'post_id',
        targetKey: 'documentId',
        as: 'post'
      });

      // Một reaction có thể thuộc về một Comment
      Reaction.belongsTo(models.Comment, {
        foreignKey: 'comment_id',
        targetKey: 'documentId',
        as: 'comment'
      });
    }
  }
  Reaction.init({
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
    post_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Posts',
        key: 'documentId'
      }
    },
    comment_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Comments',
        key: 'documentId'
      }
    },
    reaction_type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'like',
      comment: 'like, love, wow, etc.'
    }
  }, {
    sequelize,
    modelName: 'Reaction',
    paranoid: true, // Sử dụng soft delete với trường deletedAt
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'post_id'],
        where: {
          post_id: {
            [sequelize.Sequelize.Op.ne]: null
          }
        }
      },
      {
        unique: true,
        fields: ['user_id', 'comment_id'],
        where: {
          comment_id: {
            [sequelize.Sequelize.Op.ne]: null
          }
        }
      }
    ]
  });
  return Reaction;
}; 