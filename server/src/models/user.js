'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một User thuộc về một Role
      User.belongsTo(models.Role, {
        foreignKey: 'role_id', // Tên cột trong bảng User
        as: 'role' // Alias để truy cập liên kết từ User tới Role
      });
      // Một User có nhiều tài khoản xã hội
      User.hasMany(models.userSocial, {
        foreignKey: 'user_id',
        as: 'socialsAccount'
      });

      // Một User có thể là admin của nhiều Group
      User.hasMany(models.Group, {
        foreignKey: 'admin_id',
        as: 'adminGroups'
      });  
      // Một User có thể tham gia nhiều Group thông qua GroupMember (Many-to-Many)
      User.belongsToMany(models.Group, {
        through: models.group_members,
        foreignKey: 'user_id',
        otherKey: 'group_id',
        as: 'groups'
      });
      // Mối quan hệ giữa User và group_requests (một User có thể gửi nhiều yêu cầu tham gia nhóm)
      User.hasMany(models.group_request, {
        foreignKey: 'user_request',
        as: 'groupRequests'
      });
      // Mối quan hệ giữa User và group_invitations: Một User có thể gửi nhiều lời mời (invited_by)
      User.hasMany(models.group_invitation, {
        foreignKey: 'invited_by',
        as: 'sentInvitations'
      });

      // Mối quan hệ giữa User và group_invitations: Một User có thể nhận nhiều lời mời (invited_to)
      User.hasMany(models.group_invitation, {
        foreignKey: 'invited_to',
        as: 'receivedInvitations'
      });
    }
  }
  User.init({
    userName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profilePicture: DataTypes.STRING,
    bio: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    phone: DataTypes.STRING,
    gender: DataTypes.STRING,
    relationship: DataTypes.STRING,
    address: DataTypes.STRING,
    role_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};