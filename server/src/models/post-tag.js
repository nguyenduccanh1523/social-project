'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Mối quan hệ giữa PostTag và Post: Một PostTag liên kết với một Post
      PostTag.belongsTo(models.Post, {
        foreignKey: 'post_id',
        as: 'post'
      });

      // Mối quan hệ giữa PostTag và Tag: Một PostTag liên kết với một Tag
      PostTag.belongsTo(models.Tag, {
        foreignKey: 'tag_id',
        as: 'tag'
      });
    }
  }

  PostTag.init({
    post_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Posts',  // Tên bảng Posts
        key: 'id',       // Cột khóa chính trong bảng Posts
      },
    },
    tag_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Tags',  // Tên bảng Tags
        key: 'id',      // Cột khóa chính trong bảng Tags
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,  // Tự động gán thời gian tạo
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,  // Tự động gán thời gian cập nhật
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,  // Trường này có thể là null
    }
  }, {
    sequelize,
    modelName: 'PostTag',
  });

  return PostTag;
};
