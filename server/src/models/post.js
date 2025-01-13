'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Mối quan hệ giữa Post và User: Một Post thuộc về một User
      Post.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      // Mối quan hệ giữa Post và Group: Một Post có thể thuộc về một Group
      Post.belongsTo(models.Group, {
        foreignKey: 'group_id',
        as: 'group'
      });
      // Mối quan hệ giữa Post và PostMedia: Một Post có thể liên kết với nhiều Media
      Post.belongsToMany(models.Media, {
        through: models.PostMedia,
        foreignKey: 'post_id',
        otherKey: 'media_id',
        as: 'medias'
      });
    }
  }

  Post.init({
    user_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    group_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'public',  // Mặc định là 'public'
      validate: {
        isIn: [['public', 'private']],  // Chỉ chấp nhận 'public' hoặc 'private'
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    sequelize,
    modelName: 'Post',
  });

  return Post;
};
