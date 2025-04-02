'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Livestream extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một Livestream được tạo bởi một User (host)
      Livestream.belongsTo(models.User, {
        foreignKey: 'host_id',
        targetKey: 'documentId',
        as: 'host'
      });
      
      // Một Livestream có nhiều ViewLivestream
      Livestream.hasMany(models.ViewLivestream, {
        foreignKey: 'livestream_id',
        sourceKey: 'documentId',
        as: 'viewers'
      });
    }
  }
  Livestream.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    host_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    stream_url: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Livestream',
    paranoid: true // Sử dụng soft delete với trường deletedAt
  });
  return Livestream;
}; 