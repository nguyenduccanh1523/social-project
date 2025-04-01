'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Các mối quan hệ có thể được định nghĩa ở đây nếu cần
      // Ví dụ: Type.hasMany(models.Post, { foreignKey: 'type_id', as: 'posts' });
    }
  }
  Type.init({
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Type',
    paranoid: true // Để bật soft delete với trường deletedAt
  });
  return Type;
}; 