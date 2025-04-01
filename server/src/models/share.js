'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Share extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Mối quan hệ giữa Share và Post: Một Share liên kết với một Post
      Share.belongsTo(models.Post, {
        foreignKey: 'post_id',
        targetKey: 'documentId',
        as: 'post'
      });

      // Mối quan hệ giữa Share và User: Một Share liên kết với một User
      Share.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'documentId',
        as: 'user'
      });
    }
  }

  Share.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    post_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Posts',  // Tên bảng Posts
        key: 'documentId',       // Cột khóa chính trong bảng Posts
      },
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',  // Tên bảng Users
        key: 'documentId',       // Cột khóa chính trong bảng Users
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
    modelName: 'Share',
  });

  return Share;
};
