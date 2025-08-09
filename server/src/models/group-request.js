"use strict";
import { Model } from 'sequelize';
export default  (sequelize, DataTypes) => {
  class group_request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Mối quan hệ giữa group_requests và User: Mỗi yêu cầu tham gia nhóm liên kết với một User
      group_request.belongsTo(models.User, {
        foreignKey: "user_request", // Cột khóa ngoại trong bảng group_requests
        targetKey: "documentId",
        as: "user", // Alias để truy cập User từ group_requests
      });

      // Mối quan hệ giữa group_requests và Group: Mỗi yêu cầu tham gia nhóm liên kết với một Group
      group_request.belongsTo(models.Group, {
        foreignKey: "group_id", // Cột khóa ngoại trong bảng group_requests
        targetKey: "documentId",
        as: "group", // Alias để truy cập Group từ group_requests
      });

      // Mối quan hệ giữa group_requests và StatusAction: Mỗi yêu cầu tham gia nhóm liên kết với một trạng thái
      group_request.belongsTo(models.StatusAction, {
        foreignKey: "status_action_id", // Cột khóa ngoại trong bảng group_requests
        targetKey: "documentId",
        as: "statusAction", // Alias để truy cập StatusAction từ group_requests
      });
    }
  }

  group_request.init(
    {
      documentId: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      status_action_id: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "StatusActions",
          key: "documentId",
        },
      },
      group_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Groups", // Tên bảng Groups
          key: "documentId", // Cột khóa chính trong bảng Groups
        },
      },
      user_request: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Users", // Tên bảng Users
          key: "documentId", // Cột khóa chính trong bảng Users
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Gán thời gian tạo mặc định
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Gán thời gian cập nhật mặc định
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true, // Trường thời gian xóa có thể là null
      },
    },
    {
      sequelize,
      modelName: "group_request",
      tableName: "group_requests",
      freezeTableName: true, // Không tự động chuyển đổi tên bảng
      timestamps: true,
      paranoid: true,
    }
  );

  return group_request;
};
