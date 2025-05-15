'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class NotificationSetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một NotificationSetting thuộc về một User
      NotificationSetting.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'documentId',
        as: 'user'
      });
      
      // Một NotificationSetting thuộc về một NoticeType
      NotificationSetting.belongsTo(models.NoticeType, {
        foreignKey: 'notice_type_id',
        targetKey: 'documentId',
        as: 'noticeType'
      });
      
      // Một NotificationSetting thuộc về một Group
      NotificationSetting.belongsTo(models.Group, {
        foreignKey: 'group_id',
        targetKey: 'documentId',
        as: 'group'
      });
    }
  }
  NotificationSetting.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    is_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    },
    group_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Groups',
        key: 'documentId'
      }
    },
    notice_type_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'NoticeTypes',
        key: 'documentId'
      }
    }
  }, {
    sequelize,
    modelName: 'NotificationSetting',
    paranoid: true, // Sử dụng soft delete với trường deletedAt
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'notice_type_id'],
        where: {
          group_id: null
        }
      },
      {
        unique: true,
        fields: ['user_id', 'group_id', 'notice_type_id'],
        where: {
          group_id: {
            [sequelize.Sequelize.Op.ne]: null
          }
        }
      }
    ]
  });
  return NotificationSetting;
}; 