'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Faq extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một Faq thuộc về một CategorySupport
      Faq.belongsTo(models.CategorySupport, {
        foreignKey: 'category_id',
        targetKey: 'documentId',
        as: 'category'
      });
    }
  }
  Faq.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    answer: {
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
    modelName: 'Faq',
    paranoid: true // Sử dụng soft delete với trường deletedAt
  });
  return Faq;
}; 