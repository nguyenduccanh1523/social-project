'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.belongsTo(models.User, {
        foreignKey: 'admin_id',
        as: 'admin'
      });
      // Một Group có nhiều GroupMember
      Group.hasMany(models.group_members, {
        foreignKey: 'group_id',
        as: 'members'
      });
      // Một Group có nhiều User thông qua GroupMember (Many-to-Many)
      Group.belongsToMany(models.User, {
        through: models.group_members,
        foreignKey: 'group_id',
        otherKey: 'user_id',
        as: 'users'
      });
      // Mối quan hệ giữa Group và group_requests (một Group có thể có nhiều yêu cầu tham gia)
      Group.hasMany(models.group_request, {
        foreignKey: 'group_id',
        as: 'groupRequests'
      });
      // Mối quan hệ giữa Group và group_invitations: Một Group có thể có nhiều lời mời tham gia
      Group.hasMany(models.group_invitation, {
        foreignKey: 'group_id',
        as: 'groupInvitations'
      });
      Group.hasMany(models.Post, {
        foreignKey: 'group_id',
        as: 'posts'
      });
    }
  }
  Group.init({
    groupName: DataTypes.STRING,
    description: DataTypes.STRING,
    admin_id: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};