'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một Role có nhiều User
      Role.hasMany(models.User, {
        foreignKey: 'role_id', // Tên cột trong bảng User
        as: 'users' // Alias để truy cập liên kết từ Role tới User
      });
    }
  }
  Role.init({
    roleName: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};