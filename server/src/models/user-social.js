'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userSocial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
       // Một userSocial liên kết với một User
      userSocial.belongsTo(models.User, {
        foreignKey: 'user_id',  // Cột trong bảng userSocial
        as: 'user'  // Alias để truy cập User từ userSocial
      });

      // Một userSocial liên kết với một Social
      userSocial.belongsTo(models.Social, {
        foreignKey: 'social_id',  // Cột trong bảng userSocial
        as: 'social'  // Alias để truy cập Social từ userSocial
      });
    }
  }
  userS.init({
    accountUrl: DataTypes.STRING,
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    social_id: {
        type: DataTypes.STRING,
        allowNull: false
    }
  }, {
    sequelize,
    modelName: 'userSocial',
  });
  return userSocial;
};