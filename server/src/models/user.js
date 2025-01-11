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
      User.hasMany(models.userSocial, {
        foreignKey: 'user_id',
        as: 'socialsAccount'
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
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};