'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PageMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một PageMember thuộc về một Page
      PageMember.belongsTo(models.Page, {
        foreignKey: 'page_id',
        targetKey: 'documentId',
        as: 'page'
      });
      
      // Một PageMember thuộc về một User
      PageMember.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'documentId',
        as: 'user'
      });
    }
  }
  PageMember.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    page_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Pages',
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
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'member',
      comment: 'admin, member',
      validate: {
        isIn: [['admin', 'member']]
      }
    },
    joined_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'PageMember',
    paranoid: true, // Sử dụng soft delete với trường deletedAt
    indexes: [
      {
        unique: true,
        fields: ['page_id', 'user_id']
      }
    ]
  });
  return PageMember;
}; 