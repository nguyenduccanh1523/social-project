'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StatusAction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Mối quan hệ giữa StatusAction và group_request: Một StatusAction có thể có nhiều group_request
      StatusAction.hasMany(models.group_request, {
        foreignKey: 'status_action_id',
        sourceKey: 'documentId',
        as: 'groupRequests'
      });

      // Mối quan hệ giữa StatusAction và group_invitation: Một StatusAction có thể có nhiều group_invitation
      StatusAction.hasMany(models.group_invitation, {
        foreignKey: 'status_action_id',
        sourceKey: 'documentId',
        as: 'groupInvitations'
      });
    }
  }
  StatusAction.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'StatusAction',
    paranoid: true // Để bật soft delete với trường deletedAt
  });
  return StatusAction;
}; 