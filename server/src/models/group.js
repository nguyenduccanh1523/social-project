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
      // Một Group được tạo bởi một User (admin)
      Group.belongsTo(models.User, {
        foreignKey: 'admin_id',
        targetKey: 'documentId',
        as: 'admin'
      });
      
      // Một Group có một Media (hình ảnh nhóm)
      Group.belongsTo(models.Media, {
        foreignKey: 'group_image',
        targetKey: 'documentId',
        as: 'image'
      });
      
      // Một Group thuộc về một Type (loại nhóm)
      Group.belongsTo(models.Type, {
        foreignKey: 'type_id',
        targetKey: 'documentId',
        as: 'type'
      });
      
      // Một Group có nhiều GroupMember
      Group.hasMany(models.group_members, {
        foreignKey: 'group_id',
        sourceKey: 'documentId',
        as: 'members'
      });
      
      // Quan hệ nhiều-nhiều với User thông qua GroupMember
      Group.belongsToMany(models.User, {
        through: models.group_members,
        foreignKey: 'group_id',
        otherKey: 'user_id',
        as: 'users'
      });
      
      // Một Group có nhiều NotificationCreated
      Group.hasMany(models.NotificationCreated, {
        foreignKey: 'group_id',
        sourceKey: 'documentId',
        as: 'notifications'
      });
      
      // Một Group có nhiều GroupRequest
      Group.hasMany(models.group_request, {
        foreignKey: 'group_id',
        sourceKey: 'documentId',
        as: 'requests'
      });
      
      // Một Group có nhiều GroupInvitation
      Group.hasMany(models.group_invitation, {
        foreignKey: 'group_id',
        sourceKey: 'documentId',
        as: 'invitations'
      });
      
      // Một Group có nhiều Post
      Group.hasMany(models.Post, {
        foreignKey: 'group_id',
        sourceKey: 'documentId',
        as: 'posts'
      });
    }
  }
  Group.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    group_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    admin_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    },
    group_image: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Medias',
        key: 'documentId'
      }
    },
    type_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Types',
        key: 'documentId'
      }
    }
  }, {
    sequelize,
    modelName: 'Group',
    paranoid: true
  });
  return Group;
};