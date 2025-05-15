'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Guide extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một Guide thuộc về một CategorySupport
      Guide.belongsTo(models.CategorySupport, {
        foreignKey: 'category_id',
        targetKey: 'documentId',
        as: 'category'
      });
    }
  }
  Guide.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'CategorySupports',
        key: 'documentId'
      }
    }
  }, {
    sequelize,
    modelName: 'Guide',
    paranoid: true // Sử dụng soft delete với trường deletedAt
  });
  return Guide;
}; 