'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DocumentShare extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một DocumentShare thuộc về một User (tác giả)
      DocumentShare.belongsTo(models.User, {
        foreignKey: 'author',
        targetKey: 'documentId',
        as: 'creator'
      });
      
      // Một DocumentShare có thể có một Media
      DocumentShare.belongsTo(models.Media, {
        foreignKey: 'media_id',
        targetKey: 'documentId',
        as: 'media'
      });
      
      // Một DocumentShare thuộc về một Type
      DocumentShare.belongsTo(models.Type, {
        foreignKey: 'type_id',
        targetKey: 'documentId',
        as: 'documentType'
      });
      
      // Một DocumentShare có nhiều PostTag
      DocumentShare.hasMany(models.PostTag, {
        foreignKey: 'document_share_id',
        sourceKey: 'documentId',
        as: 'tags'
      });
      
      // Một DocumentShare có nhiều MarkPost
      DocumentShare.hasMany(models.MarkPost, {
        foreignKey: 'document_share_id',
        sourceKey: 'documentId',
        as: 'marks'
      });
      
      // Một DocumentShare có nhiều CmtDocument
      DocumentShare.hasMany(models.CmtDocument, {
        foreignKey: 'document_id',
        sourceKey: 'documentId',
        as: 'comments'
      });
    }
  }
  DocumentShare.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    thumbnail: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    media_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Medias',
        key: 'documentId'
      }
    },
    type_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Types',
        key: 'documentId'
      }
    },
    is_global: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    link_document: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    }
  }, {
    sequelize,
    modelName: 'DocumentShare',
    paranoid: true // Sử dụng soft delete với trường deletedAt
  });
  return DocumentShare;
}; 