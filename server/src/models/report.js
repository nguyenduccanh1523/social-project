'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một Report thuộc về một User
      Report.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'documentId',
        as: 'user'
      });
    }
  }
  Report.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false
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
    modelName: 'Report',
    paranoid: true // Sử dụng soft delete với trường deletedAt
  });
  return Report;
}; 