'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một PostTag thuộc về một Page
      PostTag.belongsTo(models.Page, {
        foreignKey: 'page_id',
        targetKey: 'documentId',
        as: 'page'
      });
      
      // Một PostTag thuộc về một Post
      PostTag.belongsTo(models.Post, {
        foreignKey: 'post_id',
        targetKey: 'documentId',
        as: 'post'
      });
      
      // Một PostTag thuộc về một DocumentShare
      PostTag.belongsTo(models.DocumentShare, {
        foreignKey: 'document_share_id',
        targetKey: 'documentId',
        as: 'documentShare'
      });
      
      // Một PostTag thuộc về một Tag
      PostTag.belongsTo(models.Tag, {
        foreignKey: 'tag_id',
        targetKey: 'documentId',
        as: 'tag'
      });
    }
  }
  PostTag.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    page_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Pages',
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
    document_share_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'DocumentShares',
        key: 'documentId'
      }
    },
    tag_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Tags',
        key: 'documentId'
      }
    }
  }, {
    sequelize,
    modelName: 'PostTag',
    paranoid: true, // Sử dụng soft delete với trường deletedAt
    indexes: [
      {
        unique: true,
        fields: ['post_id', 'tag_id'],
        where: {
          post_id: {
            [sequelize.Sequelize.Op.ne]: null
          }
        }
      },
      {
        unique: true,
        fields: ['document_share_id', 'tag_id'],
        where: {
          document_share_id: {
            [sequelize.Sequelize.Op.ne]: null
          }
        }
      }
    ]
  });
  return PostTag;
}; 