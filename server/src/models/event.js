"use strict";
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một Event được tạo bởi một User (host)
      Event.belongsTo(models.User, {
        foreignKey: "host_id",
        targetKey: "documentId",
        as: "host",
      });

      // Một Event có một Media (hình ảnh sự kiện)
      Event.belongsTo(models.Media, {
        foreignKey: "event_image",
        targetKey: "documentId",
        as: "image",
      });

      // Một Event có nhiều EventMember
      Event.hasMany(models.EventMember, {
        foreignKey: "event_id",
        sourceKey: "documentId",
        as: "members",
      });

      // Một Event có nhiều EventRequest
      Event.hasMany(models.EventRequest, {
        foreignKey: "event_id",
        sourceKey: "documentId",
        as: "requests",
      });

      // Một Event có nhiều EventInvitation
      Event.hasMany(models.EventInvitation, {
        foreignKey: "event_id",
        sourceKey: "documentId",
        as: "invitations",
      });

      // Một Event có thể có nhiều NotificationCreated
      Event.hasMany(models.NotificationCreated, {
        foreignKey: "event_id",
        sourceKey: "documentId",
        as: "notifications",
      });

      // Một Event có thể có nhiều Posts liên quan
      Event.hasMany(models.Post, {
        foreignKey: "event_id",
        sourceKey: "documentId",
        as: "posts",
      });
    }
  }
  Event.init(
    {
      documentId: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      host_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Users",
          key: "documentId",
        },
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      location: DataTypes.STRING,
      event_image: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Medias",
          key: "documentId",
        },
      },
    },
    {
      sequelize,
      modelName: "Event",
      tableName: "events",
      freezeTableName: true,
      paranoid: true, // Sử dụng soft delete với trường deletedAt
    }
  );
  return Event;
};
