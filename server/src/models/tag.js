'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Mối quan hệ giữa Tag và Post: Một Tag có thể được gán cho nhiều Post
      Tag.belongsToMany(models.Post, {
        through: models.PostTag,  // Bảng trung gian giữa Post và Tag
        foreignKey: 'tag_id',
        otherKey: 'post_id',
        as: 'posts'  // Alias để truy cập các bài viết liên kết với tag này
      });
      
      // Mối quan hệ giữa Tag và PostTag
      Tag.hasMany(models.PostTag, {
        foreignKey: 'tag_id',
        sourceKey: 'documentId',
        as: 'postTags'
      });
    }
  }

  Tag.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,  // Không cho phép giá trị null
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,  // Cho phép giá trị null
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
    modelName: 'Tag',
  });

  return Tag;
};
