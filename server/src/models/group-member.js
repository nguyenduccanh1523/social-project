'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
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
        as: 'user'
      });

      // Một group_members liên kết với một Group
      group_members.belongsTo(models.Group, {
        foreignKey: 'group_id',
        as: 'group'
      });
    }
  }

  group_members.init({
    group_id: {
      type: DataTypes.String,
      allowNull: false,
      references: {
        model: 'Groups',
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.String,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'group_members',
  });

  return group_members;
};
