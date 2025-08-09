'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một Report thuộc về một User (người tạo báo cáo)
      Report.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'documentId',
        as: 'reporter'
      });

      // Một Report có thể thuộc về một User (người bị báo cáo)
      Report.belongsTo(models.User, {
        foreignKey: 'reported_user_id',
        targetKey: 'documentId',
        as: 'reportedUser'
      });

      // Kiểm tra và tạo các mối quan hệ chỉ khi model tồn tại
      // Một Report có thể thuộc về một Post
      if (models.Post) {
        Report.belongsTo(models.Post, {
          foreignKey: 'post_id',
          targetKey: 'documentId',
          as: 'post'
        });
      }

      // Một Report có thể thuộc về một Page
      if (models.Page) {
        Report.belongsTo(models.Page, {
          foreignKey: 'page_id',
          targetKey: 'documentId',
          as: 'page'
        });
      }

      // Một Report có thể thuộc về một Group
      if (models.Group) {
        Report.belongsTo(models.Group, {
          foreignKey: 'group_id',
          targetKey: 'documentId',
          as: 'group'
        });
      }

      // Một Report có thể thuộc về một Event
      if (models.Event) {
        Report.belongsTo(models.Event, {
          foreignKey: 'event_id',
          targetKey: 'documentId',
          as: 'event'
        });
      }

      // Một Report có thể thuộc về một DocumentShare
      if (models.DocumentShare) {
        Report.belongsTo(models.DocumentShare, {
          foreignKey: 'document_share_id',
          targetKey: 'documentId',
          as: 'documentShare'
        });
      }

      // Một Report có thể thuộc về một Story
      if (models.Story) {
        Report.belongsTo(models.Story, {
          foreignKey: 'story_id',
          targetKey: 'documentId',
          as: 'story'
        });
      }

      // Một Report có thể thuộc về một LiveStream
      if (models.Livestream) { // Lưu ý: đổi từ LiveStream sang Livestream để khớp với tên model trong danh sách
        Report.belongsTo(models.Livestream, {
          foreignKey: 'livestream_id',
          targetKey: 'documentId',
          as: 'livestream'
        });
      }
    }
  }
  Report.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    },
    reported_user_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'documentId'
      }
    },
    post_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Posts',
        key: 'documentId'
      }
    },
    page_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Pages',
        key: 'documentId'
      }
    },
    group_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Groups',
        key: 'documentId'
      }
    },
    event_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Events',
        key: 'documentId'
      }
    },
    document_share_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'DocumentShares',
        key: 'documentId'
      }
    },
    story_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Stories',
        key: 'documentId'
      }
    },
    livestream_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Livestreams',
        key: 'documentId'
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'reviewing', 'resolved', 'rejected'),
      defaultValue: 'pending',
      allowNull: false
    },
    resolution_note: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Report',
    tableName: 'reports',
    freezeTableName: true,
    paranoid: true // Sử dụng soft delete với trường deletedAt
  });
  return Report;
}; 