'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class CategorySupport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một CategorySupport có nhiều FAQ
      CategorySupport.hasMany(models.Faq, {
        foreignKey: 'category_id',
        sourceKey: 'documentId',
        as: 'faqs'
      });
      
      // Một CategorySupport có nhiều Guide
      CategorySupport.hasMany(models.Guide, {
        foreignKey: 'category_id',
        sourceKey: 'documentId',
        as: 'guides'
      });
    }
  }
  CategorySupport.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'CategorySupport',
    tableName: 'categorysupports',
    freezeTableName: true,
    paranoid: true // Sử dụng soft delete với trường deletedAt
  });
  return CategorySupport;
}; 