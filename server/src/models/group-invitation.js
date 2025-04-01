'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class group_invitation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Mối quan hệ giữa group_invitations và User: Mỗi lời mời có người gửi và người nhận
      group_invitation.belongsTo(models.User, {
        foreignKey: 'invited_by', // Cột khóa ngoại trong bảng group_invitations
        targetKey: 'documentId',
        as: 'inviter'  // Alias để truy cập người gửi lời mời
      });

      group_invitation.belongsTo(models.User, {
        foreignKey: 'invited_to', // Cột khóa ngoại trong bảng group_invitations
        targetKey: 'documentId',
        as: 'invitee'  // Alias để truy cập người được mời
      });

      // Mối quan hệ giữa group_invitations và Group: Mỗi lời mời thuộc về một Group
      group_invitation.belongsTo(models.Group, {
        foreignKey: 'group_id', // Cột khóa ngoại trong bảng group_invitations
        targetKey: 'documentId',
        as: 'group'  // Alias để truy cập thông tin nhóm
      });

      // Mối quan hệ giữa group_invitations và StatusAction: Mỗi lời mời thuộc về một trạng thái
      group_invitation.belongsTo(models.StatusAction, {
        foreignKey: 'status_action_id', // Cột khóa ngoại trong bảng group_invitations
        targetKey: 'documentId',
        as: 'statusAction'  // Alias để truy cập thông tin trạng thái
      });
    }
  }

  group_invitation.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    status_action_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'StatusActions',
        key: 'documentId',
      },
    },
    responded_at: {
      type: DataTypes.DATE,
      allowNull: true,  // Trường thời gian phản hồi có thể null
    },
    group_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Groups',  // Tên bảng Groups
        key: 'documentId',        // Cột khóa chính trong bảng Groups
      },
    },
    invited_by: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',   // Tên bảng Users
        key: 'documentId',        // Cột khóa chính trong bảng Users
      },
    },
    invited_to: {
      type: DataTypes.STRING,
      allowNull: false, 
      references: {
        model: 'Users',   // Tên bảng Users
        key: 'documentId',        // Cột khóa chính trong bảng Users
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
      allowNull: true,  // Trường thời gian xóa có thể là null
    }
  }, {
    sequelize,
    modelName: 'group_invitation',
  });

  return group_invitation;
};
