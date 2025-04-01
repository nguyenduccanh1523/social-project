'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CmtDocument extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một CmtDocument thuộc về một DocumentShare
      CmtDocument.belongsTo(models.DocumentShare, {
        foreignKey: 'document_id',
        targetKey: 'documentId',
        as: 'documentShare'
      });
      
      // Một CmtDocument thuộc về một User
      CmtDocument.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'documentId',
        as: 'user'
      });
      
      // Một CmtDocument có thể là phản hồi cho một CmtDocument khác (self-referencing)
      CmtDocument.belongsTo(models.CmtDocument, {
        foreignKey: 'parent_id',
        targetKey: 'documentId',
        as: 'parent'
      });
      
      // Một CmtDocument có thể có nhiều CmtDocument phản hồi (self-referencing)
      CmtDocument.hasMany(models.CmtDocument, {
        foreignKey: 'parent_id',
        sourceKey: 'documentId',
        as: 'replies'
      });
    }
  }
  CmtDocument.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    document_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'DocumentShares',
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
    },
    parent_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'CmtDocuments',
        key: 'documentId'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'CmtDocument',
    paranoid: true // Sử dụng soft delete với trường deletedAt
  });
  return CmtDocument;
}; 