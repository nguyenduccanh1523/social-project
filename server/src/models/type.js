"use strict";
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Quan hệ với User
      Type.hasMany(models.User, {
        foreignKey: "type_id",
        sourceKey: "documentId",
        as: "users",
      });

      // Quan hệ với Post
      Type.hasMany(models.Post, {
        foreignKey: "type_id",
        sourceKey: "documentId",
        as: "posts",
      });

      // Quan hệ với Story
      Type.hasMany(models.Story, {
        foreignKey: "type_id",
        sourceKey: "documentId",
        as: "stories",
      });

      // Quan hệ với Group
      Type.hasMany(models.Group, {
        foreignKey: "type_id",
        sourceKey: "documentId",
        as: "groups",
      });

      // Quan hệ với StatusActivity
      Type.hasMany(models.StatusActivity, {
        foreignKey: "type_id",
        sourceKey: "documentId",
        as: "statusActivities",
      });

      // Quan hệ với Media
      Type.hasMany(models.Media, {
        foreignKey: "type_id",
        sourceKey: "documentId",
        as: "medias",
      });
      
      // Quan hệ với DocumentShare
      Type.hasMany(models.DocumentShare, {
        foreignKey: "type_id",
        sourceKey: "documentId",
        as: "documentShares",
      });
    }
  }
  Type.init(
    {
      documentId: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Type",
      paranoid: true, // Để bật soft delete với trường deletedAt
    }
  );
  return Type;
};
