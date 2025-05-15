'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class StatusActivity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Mối quan hệ giữa StatusActivity và User: Một StatusActivity có thể có nhiều User
      StatusActivity.hasMany(models.User, {
        foreignKey: 'status_id',
        sourceKey: 'documentId',
        as: 'users'
      });
      
      // Mối quan hệ giữa StatusActivity và Type
      StatusActivity.belongsTo(models.Type, {
        foreignKey: 'type_id',
        targetKey: 'documentId',
        as: 'type'
      });
    }
  }
  StatusActivity.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Types',
        key: 'documentId'
      }
    }
  }, {
    sequelize,
    modelName: 'StatusActivity',
    paranoid: true // Để bật soft delete với trường deletedAt
  });
  return StatusActivity;
}; 