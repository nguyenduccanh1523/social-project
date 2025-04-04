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
        through: {
          model: models.PostMedia,
          unique: false
        },
        foreignKey: 'media_id',
        otherKey: 'post_id',
        sourceKey: 'documentId',
        targetKey: 'documentId',
        constraints: false,
        as: 'posts'
      });

      // Mối quan hệ giữa Media và Type: Một Media thuộc về một Type
      Media.belongsTo(models.Type, {
        foreignKey: 'type_id',
        targetKey: 'documentId',
        as: 'mediaType'
      });

      // Một Media được sử dụng trong nhiều Post
      Media.hasMany(models.PostMedia, {
        foreignKey: 'media_id',
        sourceKey: 'documentId',
        as: 'postMedia'
      });
      
      // Một Media được sử dụng trong nhiều Story
      Media.hasMany(models.Story, {
        foreignKey: 'media_id',
        sourceKey: 'documentId',
        as: 'stories'
      });
      
      // Một Media được sử dụng trong nhiều Message
      Media.hasMany(models.Message, {
        foreignKey: 'media_id',
        sourceKey: 'documentId',
        as: 'messages'
      });
      
      // Một Media được sử dụng trong nhiều DocumentShare
      Media.hasMany(models.DocumentShare, {
        foreignKey: 'media_id',
        sourceKey: 'documentId',
        as: 'documentShares'
      });
      
      // Một Media được sử dụng bởi nhiều Page (profile_picture)
      Media.hasMany(models.Page, {
        foreignKey: 'profile_picture',
        sourceKey: 'documentId',
        as: 'pageProfiles'
      });
      
      // Một Media được sử dụng bởi nhiều Page (cover_picture)
      Media.hasMany(models.Page, {
        foreignKey: 'cover_picture',
        sourceKey: 'documentId',
        as: 'pageCovers'
      });
      
      // Một Media được sử dụng bởi nhiều Group (profile_picture)
      Media.hasMany(models.Group, {
        foreignKey: 'group_image',
        sourceKey: 'documentId',
        as: 'groupImages'
      });
      
      // Một Media được sử dụng bởi nhiều Event (image)
      Media.hasMany(models.Event, {
        foreignKey: 'event_image',
        sourceKey: 'documentId',
        as: 'eventImages'
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
    tableName: 'Medias',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true
  });

  return Media;
};
