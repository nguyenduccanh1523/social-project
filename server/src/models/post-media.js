"use strict";
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class PostMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Mối quan hệ giữa PostMedia và Post: Một PostMedia liên kết với một Post
      PostMedia.belongsTo(models.Post, {
        foreignKey: "post_id",
        targetKey: "documentId",
        as: "post",
      });

      // Mối quan hệ giữa PostMedia và Media: Một PostMedia liên kết với một Media
      PostMedia.belongsTo(models.Media, {
        foreignKey: "media_id",
        targetKey: "documentId",
        as: "media",
      });
    }
  }

  PostMedia.init(
    {
      documentId: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      post_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Posts", // Tên bảng Posts
          key: "documentId", // Cột khóa chính trong bảng Posts
        },
      },
      media_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Medias", // Tên bảng Medias
          key: "documentId", // Cột khóa chính trong bảng Medias
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true, // Trường này có thể là null
      },
    },
    {
      sequelize,
      modelName: "PostMedia",
      tableName: "post_medias", // Chỉ định tên bảng trong database
      timestamps: true,
      paranoid: true,
    }
  );

  return PostMedia;
};
