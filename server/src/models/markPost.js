'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class MarkPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một MarkPost thuộc về một DocumentShare
      MarkPost.belongsTo(models.DocumentShare, {
        foreignKey: 'document_share_id',
        targetKey: 'documentId',
        as: 'documentShare'
      });
      
      // Một MarkPost thuộc về một Post
      MarkPost.belongsTo(models.Post, {
        foreignKey: 'post_id',
        targetKey: 'documentId',
        as: 'post'
      });
      
      // Một MarkPost thuộc về một User
      MarkPost.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'documentId',
        as: 'user'
      });
    }
  }
  MarkPost.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    document_share_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'DocumentShares',
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
    modelName: 'MarkPost',
    tableName: 'markposts',
    freezeTableName: true,
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
        fields: ['user_id', 'document_share_id'],
        where: {
          document_share_id: {
            [sequelize.Sequelize.Op.ne]: null
          }
        }
      }
    ]
  });
  return MarkPost;
}; 