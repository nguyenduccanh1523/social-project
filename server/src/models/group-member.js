'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class group_members extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một group_members liên kết với một User
      group_members.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'documentId',
        as: 'user'
      });

      // Một group_members liên kết với một Group
      group_members.belongsTo(models.Group, {
        foreignKey: 'group_id',
        targetKey: 'documentId',
        as: 'group'
      });
    }
  }

  group_members.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    group_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Groups',
        key: 'documentId',
      },
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'documentId',
      },
    },
    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'group_members',
    tableName: 'group_members',
    freezeTableName: true,
  });

  return group_members;
};
