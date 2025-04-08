"use strict";
const { Model } = require("sequelize");
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
        foreignKey: "role_id", // Tên cột trong bảng User
        targetKey: "documentId", // Tên cột trong bảng Role
        as: "role", // Alias để truy cập liên kết từ User tới Role
      });

      // Một User thuộc về một StatusActivity
      User.belongsTo(models.StatusActivity, {
        foreignKey: "status_id",
        targetKey: "documentId",
        as: "status",
      });

      // Một User thuộc về một Type
      User.belongsTo(models.Type, {
        foreignKey: "type_id",
        targetKey: "documentId",
        as: "userType",
      });

      // Một User có nhiều tài khoản xã hội
      User.hasMany(models.userSocial, {
        foreignKey: "user_id",
        sourceKey: "documentId",
        as: "socialAccounts",
      });

      // Một User có avatar từ Media
      User.belongsTo(models.Media, {
        foreignKey: "avatar_id",
        targetKey: "documentId",
        as: "avatarMedia",
      });

      // Một User có cover photo từ Media
      User.belongsTo(models.Media, {
        foreignKey: "cover_photo_id",
        targetKey: "documentId",
        as: "coverPhotoMedia",
      });

      // Một User có thể là admin của nhiều Group
      User.hasMany(models.Group, {
        foreignKey: "admin_id",
        sourceKey: "documentId",
        as: "adminGroups",
      });
      // Một User có thể tham gia nhiều Group thông qua GroupMember (Many-to-Many)
      User.belongsToMany(models.Group, {
        through: models.group_members,
        foreignKey: "user_id",
        otherKey: "group_id",
        as: "groups",
      });
      // Mối quan hệ giữa User và group_requests (một User có thể gửi nhiều yêu cầu tham gia nhóm)
      User.hasMany(models.group_request, {
        foreignKey: "user_request",
        sourceKey: "documentId",
        as: "groupRequests",
      });
      // Mối quan hệ giữa User và group_invitations: Một User có thể gửi nhiều lời mời (invited_by)
      User.hasMany(models.group_invitation, {
        foreignKey: "invited_by",
        sourceKey: "documentId",
        as: "sentInvitations",
      });
      // Mối quan hệ giữa User và group_invitations: Một User có thể nhận nhiều lời mời (invited_to)
      User.hasMany(models.group_invitation, {
        foreignKey: "invited_to",
        sourceKey: "documentId",
        as: "receivedInvitations",
      });
      // Mối quan hệ giữa User và Post: Một User có thể tạo nhiều Post
      User.hasMany(models.Post, {
        foreignKey: "user_id",
        sourceKey: "documentId",
        as: "posts",
      });
      // Mối quan hệ giữa User và Share: Một User có thể chia sẻ nhiều bài viết
      User.hasMany(models.Share, {
        foreignKey: "user_id",
        sourceKey: "documentId",
        as: "shares",
      });

      // User thuộc về một Nation
      User.belongsTo(models.Nation, {
        foreignKey: "nation_id",
        targetKey: "documentId",
        as: "nation",
      });

      // User tham gia nhiều group với quan hệ nhiều-nhiều
      User.belongsToMany(models.Group, {
        through: models.group_members,
        foreignKey: "user_id",
        otherKey: "group_id",
        as: "memberGroups",
      });

      // User tham gia nhiều Page với quan hệ nhiều-nhiều
      User.belongsToMany(models.Page, {
        through: models.PageMember,
        foreignKey: "user_id",
        otherKey: "page_id",
        as: "memberPages",
      });

      // User có nhiều PageMember
      User.hasMany(models.PageMember, {
        foreignKey: "user_id",
        sourceKey: "documentId",
        as: "pageMembers",
      });

      // User có nhiều nhóm thành viên
      User.hasMany(models.group_members, {
        foreignKey: "user_id",
        sourceKey: "documentId",
        as: "groupMemberships",
      });

      // User có nhiều cuộc trò chuyện đã tạo
      User.hasMany(models.Conversation, {
        foreignKey: "conversation_created_by",
        sourceKey: "documentId",
        as: "createdConversations",
      });

      // User có nhiều cuộc trò chuyện được chat với
      User.hasMany(models.Conversation, {
        foreignKey: "user_chated_with",
        sourceKey: "documentId",
        as: "personalConversations",
      });

      // User tham gia nhiều cuộc trò chuyện
      User.belongsToMany(models.Conversation, {
        through: models.ConversationParticipant,
        foreignKey: "user_id",
        otherKey: "conversation_id",
        as: "conversations",
      });

      // User có nhiều tin nhắn đã gửi
      User.hasMany(models.Message, {
        foreignKey: "sender_id",
        sourceKey: "documentId",
        as: "sentMessages",
      });

      // User có nhiều tin nhắn đã nhận
      User.hasMany(models.Message, {
        foreignKey: "receiver_id",
        sourceKey: "documentId",
        as: "receivedMessages",
      });

      // User có nhiều reaction
      User.hasMany(models.Reaction, {
        foreignKey: "user_id",
        sourceKey: "documentId",
        as: "reactions",
      });

      // User có nhiều bạn bè (Friend - user_id)
      User.hasMany(models.Friend, {
        foreignKey: "user_id",
        sourceKey: "documentId",
        as: "sentFriendRequests",
      });

      // User được nhiều người kết bạn (Friend - friend_id)
      User.hasMany(models.Friend, {
        foreignKey: "friend_id",
        sourceKey: "documentId",
        as: "receivedFriendRequests",
      });

      // User có nhiều story
      User.hasMany(models.Story, {
        foreignKey: "user_id",
        sourceKey: "documentId",
        as: "stories",
      });

      // User xem nhiều story
      User.hasMany(models.ViewStory, {
        foreignKey: "user_id",
        sourceKey: "documentId",
        as: "viewedStories",
      });

      // User là host của nhiều sự kiện
      User.hasMany(models.Event, {
        foreignKey: "host_id",
        sourceKey: "documentId",
        as: "hostedEvents",
      });

      // User tham gia nhiều sự kiện
      User.hasMany(models.EventMember, {
        foreignKey: "user_id",
        sourceKey: "documentId",
        as: "eventMemberships",
      });

      // User yêu cầu tham gia nhiều sự kiện
      User.hasMany(models.EventRequest, {
        foreignKey: "user_request",
        sourceKey: "documentId",
        as: "eventRequests",
      });

      // User mời người khác tham gia sự kiện
      User.hasMany(models.EventInvitation, {
        foreignKey: "invited_by",
        sourceKey: "documentId",
        as: "sentEventInvitations",
      });

      // User được mời tham gia sự kiện
      User.hasMany(models.EventInvitation, {
        foreignKey: "invited_to",
        sourceKey: "documentId",
        as: "receivedEventInvitations",
      });

      // User có nhiều NotificationCreated
      User.hasMany(models.NotificationCreated, {
        foreignKey: "user_id",
        sourceKey: "documentId",
        as: "notificationCreated",
      });

      // User có nhiều Page đã tạo
      User.hasMany(models.Page, {
        foreignKey: "author",
        sourceKey: "documentId",
        as: "createdPages",
      });

      // User có nhiều DocumentShare đã tạo
      User.hasMany(models.DocumentShare, {
        foreignKey: "author",
        sourceKey: "documentId",
        as: "documentShares",
      });

      // User có nhiều MarkPost
      User.hasMany(models.MarkPost, {
        foreignKey: "user_id",
        sourceKey: "documentId",
        as: "markPosts",
      });

      // User có nhiều CmtDocument
      User.hasMany(models.CmtDocument, {
        foreignKey: "user_id",
        sourceKey: "documentId",
        as: "documentComments",
      });

      // User có nhiều UserNotification
      User.hasMany(models.UserNotification, {
        foreignKey: "user_id",
        sourceKey: "documentId",
        as: "notifications",
      });

      // User có nhiều Notification thông qua UserNotification
      User.belongsToMany(models.Notification, {
        through: models.UserNotification,
        foreignKey: "user_id",
        otherKey: "notification_id",
        as: "allNotifications",
      });

      // User có nhiều NotificationSetting
      User.hasMany(models.NotificationSetting, {
        foreignKey: "user_id",
        sourceKey: "documentId",
        as: "notificationSettings",
      });

      // User có nhiều Call (gọi đi)
      User.hasMany(models.Call, {
        foreignKey: "caller_id",
        sourceKey: "documentId",
        as: "outgoingCalls",
      });

      // User có nhiều Call (gọi đến)
      User.hasMany(models.Call, {
        foreignKey: "receiver_id",
        sourceKey: "documentId",
        as: "incomingCalls",
      });

      // User host nhiều Livestream
      User.hasMany(models.Livestream, {
        foreignKey: "host_id",
        sourceKey: "documentId",
        as: "hostedLivestreams",
      });

      // User xem nhiều Livestream thông qua ViewLivestream
      User.hasMany(models.ViewLivestream, {
        foreignKey: "user_id",
        sourceKey: "documentId",
        as: "viewedLivestreams",
      });

      // User chặn nhiều User khác
      User.hasMany(models.Blocklist, {
        foreignKey: "user_id",
        sourceKey: "documentId",
        as: "blockedUsers",
      });

      // User bị nhiều User khác chặn
      User.hasMany(models.Blocklist, {
        foreignKey: "blocked_user_id",
        sourceKey: "documentId",
        as: "blockedByUsers",
      });

      // User có nhiều Report
      User.hasMany(models.Report, {
        foreignKey: "user_id",
        sourceKey: "documentId",
        as: "reports",
      });

      // User có nhiều PostFriend
      User.hasMany(models.PostFriend, {
        foreignKey: "user_id",
        sourceKey: "documentId",
        as: "taggedInPosts",
      });
    }
  }
  User.init(
    {
      documentId: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      fullname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date_of_birth: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Roles",
          key: "documentId",
        },
      },
      status_id: {
        type: DataTypes.STRING,
        references: {
          model: "StatusActivities",
          key: "documentId",
        },
      },
      nation_id: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Nations",
          key: "documentId",
        },
      },
      type_id: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Types",
          key: "documentId",
        },
      },
      last_active: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      reset_password_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      reset_password_expires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      avatar_id: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Medias",
          key: "documentId",
        },
      },
      cover_photo_id: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Medias",
          key: "documentId",
        },
      },
      is_online: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_blocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      about: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      refresh_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      refresh_token_expires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true,
      paranoid: true, // Sử dụng soft delete với trường deletedAt
    }
  );
  return User;
};
