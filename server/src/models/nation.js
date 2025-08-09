'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Nation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một Nation có nhiều Page
      Nation.hasMany(models.Page, {
        foreignKey: 'lives_in',
        sourceKey: 'documentId',
        as: 'pages'
      });
      
      // Một Nation có nhiều User
      Nation.hasMany(models.User, {
        foreignKey: 'nation_id',
        sourceKey: 'documentId',
        as: 'users'
      });
    }
  }
  Nation.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    niceName: DataTypes.TEXT,
    iso: DataTypes.TEXT,
    phoneCode: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Nation',
    tableName: 'nations',
    freezeTableName: true,
    paranoid: true // Sử dụng soft delete với trường deletedAt
  });
  return Nation;
}; 