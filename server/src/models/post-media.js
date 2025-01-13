'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Mối quan hệ giữa PostMedia và Post: Một PostMedia liên kết với một Post
      PostMedia.belongsTo(models.Post, {
        foreignKey: 'post_id',
        as: 'post'
      });

      // Mối quan hệ giữa PostMedia và Media: Một PostMedia liên kết với một Media
      PostMedia.belongsTo(models.Media, {
        foreignKey: 'media_id',
        as: 'media'
      });
    }
  }

  PostMedia.init({
    post_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Posts',  // Tên bảng Posts
        key: 'id',       // Cột khóa chính trong bảng Posts
      },
    },
    media_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Medias',  // Tên bảng Medias
        key: 'id',        // Cột khóa chính trong bảng Medias
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
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,  // Trường này có thể là null
    }
  }, {
    sequelize,
    modelName: 'PostMedia',
  });

  return PostMedia;
};
