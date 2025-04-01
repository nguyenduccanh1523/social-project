'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Story extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một story được tạo bởi một User
      Story.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'documentId',
        as: 'user'
      });

      // Một story có thể có một media
      Story.belongsTo(models.Media, {
        foreignKey: 'media_id',
        targetKey: 'documentId',
        as: 'media'
      });

      // Một story thuộc về một Type
      Story.belongsTo(models.Type, {
        foreignKey: 'type_id',
        targetKey: 'documentId',
        as: 'type'
      });

      // Một story có thể được xem bởi nhiều users
      Story.hasMany(models.ViewStory, {
        foreignKey: 'story_id',
        sourceKey: 'documentId',
        as: 'views'
      });
    }
  }
  Story.init({
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
    media_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Medias',
        key: 'documentId'
      }
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('text');
        if (value) {
          try {
            return JSON.parse(value);
          } catch (error) {
            return value;
          }
        }
        return null;
      },
      set(value) {
        if (value && typeof value === 'object') {
          this.setDataValue('text', JSON.stringify(value));
        } else {
          this.setDataValue('text', value);
        }
      }
    },
    background: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    story_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: 'image, video, text',
      validate: {
        isIn: [['image', 'video', 'text']]
      }
    },
    status_story: {
      type: DataTypes.STRING(20),
      defaultValue: 'active',
      comment: 'active, expired',
      validate: {
        isIn: [['active', 'expired']]
      }
    },
    type_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Types',
        key: 'documentId'
      }
    },
    expired_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Story',
    paranoid: true, // Sử dụng soft delete với trường deletedAt
    hooks: {
      beforeCreate: (story) => {
        // Set thời gian hết hạn mặc định là 24 giờ sau khi tạo
        if (!story.expired_at) {
          const expired = new Date();
          expired.setHours(expired.getHours() + 24);
          story.expired_at = expired;
        }
      }
    }
  });
  return Story;
}; 