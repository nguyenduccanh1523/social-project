'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class ViewLivestream extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một ViewLivestream thuộc về một User
      ViewLivestream.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'documentId',
        as: 'user'
      });
      
      // Một ViewLivestream thuộc về một Livestream
      ViewLivestream.belongsTo(models.Livestream, {
        foreignKey: 'livestream_id',
        targetKey: 'documentId',
        as: 'livestream'
      });
    }
  }
  ViewLivestream.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    },
    livestream_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Livestreams',
        key: 'documentId'
      }
    },
    expired_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'ViewLivestream',
    tableName: 'viewlivestreams',
    paranoid: true, // Sử dụng soft delete với trường deletedAt
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'livestream_id']
      }
    ]
  });
  return ViewLivestream;
}; 