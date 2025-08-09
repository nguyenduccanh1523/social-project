'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class ViewStory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một view thuộc về một User
      ViewStory.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'documentId',
        as: 'user'
      });

      // Một view thuộc về một Story
      ViewStory.belongsTo(models.Story, {
        foreignKey: 'story_id',
        targetKey: 'documentId',
        as: 'story'
      });
    }
  }
  ViewStory.init({
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
    story_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Stories',
        key: 'documentId'
      }
    },
    expired_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ViewStory',
    tableName: 'viewstories',
    freezeTableName: true,
    paranoid: true, // Sử dụng soft delete với trường deletedAt
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'story_id']
      }
    ],
    hooks: {
      beforeCreate: (viewStory) => {
        // Set thời gian hết hạn mặc định là 24 giờ sau khi tạo
        if (!viewStory.expired_at) {
          const expired = new Date();
          expired.setHours(expired.getHours() + 24);
          viewStory.expired_at = expired;
        }
      }
    }
  });
  return ViewStory;
}; 