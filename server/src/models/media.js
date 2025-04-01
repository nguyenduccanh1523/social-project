'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Mối quan hệ giữa Media và Post thông qua PostMedia
      Media.belongsToMany(models.Post, {
        through: models.PostMedia,
        foreignKey: 'media_id',
        otherKey: 'post_id',
        as: 'posts'
      });

      // Mối quan hệ giữa Media và Type: Một Media thuộc về một Type
      Media.belongsTo(models.Type, {
        foreignKey: 'type_id',
        targetKey: 'documentId',
        as: 'mediaType'
      });
    }
  }

  Media.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    file_path: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    file_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    file_size: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    type_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Types',
        key: 'documentId'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Media',
    paranoid: true // Sử dụng soft delete với trường deletedAt
  });

  return Media;
};
