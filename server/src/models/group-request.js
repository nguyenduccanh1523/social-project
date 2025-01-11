'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class group_request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Mối quan hệ giữa group_requests và User: Mỗi yêu cầu tham gia nhóm liên kết với một User
      group_request.belongsTo(models.User, {
        foreignKey: 'user_request', // Cột khóa ngoại trong bảng group_requests
        as: 'user' // Alias để truy cập User từ group_requests
      });

      // Mối quan hệ giữa group_requests và Group: Mỗi yêu cầu tham gia nhóm liên kết với một Group
      group_request.belongsTo(models.Group, {
        foreignKey: 'group_id', // Cột khóa ngoại trong bảng group_requests
        as: 'group' // Alias để truy cập Group từ group_requests
      });
    }
  }

  group_request.init({
    request_status: {
      type: DataTypes.STRING,
      defaultValue: 'pending', // Trạng thái yêu cầu mặc định là 'pending'
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Groups',  // Tên bảng Groups
        key: 'id',        // Cột khóa chính trong bảng Groups
      },
    },
    user_request: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',   // Tên bảng Users
        key: 'id',        // Cột khóa chính trong bảng Users
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Gán thời gian tạo mặc định
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Gán thời gian cập nhật mặc định
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true, // Trường thời gian xóa có thể là null
    }
  }, {
    sequelize,
    modelName: 'group_request',
  });

  return group_request;
};
