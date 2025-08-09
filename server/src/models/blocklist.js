'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Blocklist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một Blocklist thuộc về một User (người chặn)
      Blocklist.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'documentId',
        as: 'user'
      });
      
      // Một Blocklist thuộc về một User (người bị chặn)
      Blocklist.belongsTo(models.User, {
        foreignKey: 'blocked_user_id',
        targetKey: 'documentId',
        as: 'blockedUser'
      });
    }
  }
  Blocklist.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    },
    blocked_user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    },
    blocked_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Blocklist',
    tableName: 'blocklists',
    freezeTableName: true,
    paranoid: true, // Sử dụng soft delete với trường deletedAt
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'blocked_user_id']
      }
    ]
  });
  return Blocklist;
}; 