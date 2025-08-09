"use strict";
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Mối quan hệ giữa Post và User: Một Post thuộc về một User
      Post.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "documentId",
        as: "user",
      });

      // Mối quan hệ giữa Post và Group: Một Post có thể thuộc về một Group
      Post.belongsTo(models.Group, {
        foreignKey: "group_id",
        targetKey: "documentId",
        as: "group",
      });

      // Mối quan hệ giữa Post và Page: Một Post có thể thuộc về một Page
      Post.belongsTo(models.Page, {
        foreignKey: "page_id",
        targetKey: "documentId",
        as: "page",
      });

      // Mối quan hệ giữa Post và PostMedia: Một Post có thể liên kết với nhiều Media
      Post.belongsToMany(models.Media, {
        through: {
          model: models.PostMedia,
          unique: false,
        },
        foreignKey: "post_id",
        otherKey: "media_id",
        sourceKey: "documentId",
        targetKey: "documentId",
        constraints: false,
        as: "medias",
      });

      // Mối quan hệ giữa Post và Tag: Một Post có thể có nhiều Tag thông qua bảng post_tags
      Post.belongsToMany(models.Tag, {
        through: {
          model: models.PostTag,
          unique: false,
        },
        foreignKey: "post_id",
        otherKey: "tag_id",
        sourceKey: "documentId",
        targetKey: "documentId",
        constraints: false,
        as: "tags", // Alias để truy cập các thẻ của bài viết
      });

      // Mối quan hệ giữa Post và Share: Một Post có thể được chia sẻ nhiều lần
      Post.hasMany(models.Share, {
        foreignKey: "post_id",
        sourceKey: "documentId",
        as: "shares",
      });

      // Thêm mối quan hệ với Type
      Post.belongsTo(models.Type, {
        foreignKey: "type_id",
        targetKey: "documentId",
        as: "postType",
      });

      // Mối quan hệ với MarkPost
      Post.hasMany(models.MarkPost, {
        foreignKey: "post_id",
        sourceKey: "documentId",
        as: "marks",
      });

      // Mối quan hệ với Comment
      Post.hasMany(models.Comment, {
        foreignKey: "post_id",
        sourceKey: "documentId",
        as: "comments",
      });

      // Mối quan hệ với Reaction
      Post.hasMany(models.Reaction, {
        foreignKey: "post_id",
        sourceKey: "documentId",
        as: "reactions",
      });

      // Mối quan hệ với PostFriend
      Post.hasMany(models.PostFriend, {
        foreignKey: "post_id",
        sourceKey: "documentId",
        as: "friends",
      });

      // Mối quan hệ giữa Post và Event: Một Post có thể liên quan đến một Event
      Post.belongsTo(models.Event, {
        foreignKey: "event_id",
        targetKey: "documentId",
        as: "event",
      });
    }
  }

  Post.init(
    {
      documentId: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      group_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      page_id: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Pages",
          key: "documentId",
        },
      },
      type_id: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Types",
          key: "documentId",
        },
      },
      event_id: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Events",
          key: "documentId",
        },
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "public", // Mặc định là 'public'
        validate: {
          isIn: [["public", "private"]], // Chỉ chấp nhận 'public' hoặc 'private'
        },
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Post",
      tableName: "posts",
      freezeTableName: true,
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      deletedAt: "deletedAt",
      paranoid: true,
    }
  );

  return Post;
};
