'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Call extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một Call có một người gọi (caller)
      Call.belongsTo(models.User, {
        foreignKey: 'caller_id',
        targetKey: 'documentId',
        as: 'caller'
      });
      
      // Một Call có một người nhận (receiver)
      Call.belongsTo(models.User, {
        foreignKey: 'receiver_id',
        targetKey: 'documentId',
        as: 'receiver'
      });
    }
  }
  Call.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    caller_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    },
    receiver_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    call_type: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'video/audio',
      validate: {
        isIn: [['video', 'audio']]
      }
    }
  }, {
    sequelize,
    modelName: 'Call',
    tableName: 'calls',
    freezeTableName: true,
    paranoid: true // Sử dụng soft delete với trường deletedAt
  });
  return Call;
}; 