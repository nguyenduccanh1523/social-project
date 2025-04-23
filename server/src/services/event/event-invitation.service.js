import db from "../../models";
import { Op } from "sequelize";
import * as eventMemberService from "./event-member.service";

// Lấy tất cả event-invitations có phân trang và lọc
export const getAllEventInvitations = async ({
  page = 1,
  pageSize = 10,
  sortField = "createdAt",
  sortOrder = "DESC",
  populate = false,
  invitedBy = null,
  invitedTo = null,
  eventId = null,
  statusId = null,
}) => {
  try {
    const offset = (page - 1) * pageSize;
    const whereConditions = {};

    // Lọc theo invitedBy nếu được cung cấp
    if (invitedBy) {
      whereConditions.invited_by = invitedBy;
    }

    // Lọc theo invitedTo nếu được cung cấp
    if (invitedTo) {
      whereConditions.invited_to = invitedTo;
    }

    // Lọc theo eventId nếu được cung cấp
    if (eventId) {
      whereConditions.event_id = eventId;
    }

    // Lọc theo statusId nếu được cung cấp
    if (statusId) {
      whereConditions.invitation_status = statusId;
    }

    // Chuẩn bị các mối quan hệ cần include
    const includes = [];

    if (populate) {
      includes.push(
        {
          model: db.User,
          as: "sender",
          attributes: ["documentId", "fullname", "email", "avatar_id"],
        },
        {
          model: db.User,
          as: "receiver",
          attributes: ["documentId", "fullname", "email", "avatar_id"],
        },
        {
          model: db.Event,
          as: "event",
          attributes: ["documentId", "name", "description", "host_id"],
        },
        {
          model: db.StatusAction,
          as: "status",
          attributes: ["documentId", "name", "description"],
        }
      );
    }

    // Thực hiện truy vấn
    const { count, rows } = await db.EventInvitation.findAndCountAll({
      where: whereConditions,
      include: includes,
      order: [[sortField, sortOrder]],
      offset,
      limit: pageSize,
      distinct: true,
      attributes: {
        exclude: ["status_action_id"], // Loại bỏ cột gây lỗi
      },
    });

    return {
      data: rows,
      meta: {
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          pageCount: Math.ceil(count / pageSize),
          total: count,
        },
      },
    };
  } catch (error) {
    throw new Error(
      `Lỗi khi lấy danh sách lời mời tham gia sự kiện: ${error.message}`
    );
  }
};

// Lấy event-invitation theo ID
export const getEventInvitationById = async (documentId) => {
  try {
    const invitation = await db.EventInvitation.findByPk(documentId, {
      include: [
        {
          model: db.User,
          as: "sender",
          attributes: ["documentId", "fullname", "email", "avatar_id"],
        },
        {
          model: db.User,
          as: "receiver",
          attributes: ["documentId", "fullname", "email", "avatar_id"],
        },
        {
          model: db.Event,
          as: "event",
          attributes: ["documentId", "name", "description", "host_id"],
        },
        {
          model: db.StatusAction,
          as: "status",
          attributes: ["documentId", "name", "description"],
        },
      ],
      attributes: {
        exclude: ["status_action_id"], // Loại bỏ cột gây lỗi
      },
    });

    if (!invitation) {
      throw new Error("Không tìm thấy lời mời");
    }

    return invitation;
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông tin lời mời: ${error.message}`);
  }
};

// Kiểm tra quyền gửi lời mời tham gia sự kiện (chỉ người tổ chức hoặc người tham gia sự kiện mới có quyền gửi)
export const checkInvitePermission = async (userId, eventId) => {
  try {
    // Kiểm tra xem người dùng có phải là người tổ chức của sự kiện không
    const event = await db.Event.findByPk(eventId, {
      attributes: {
        exclude: ["status_action_id"], // Loại bỏ cột gây lỗi
      },
    });
    if (event && event.organizer_id === userId) {
      return true;
    }

    // Kiểm tra xem người dùng có phải là người tham gia của sự kiện không
    const isMember = await eventMemberService.checkEventMembership(
      userId,
      eventId
    );
    return isMember;
  } catch (error) {
    throw new Error(`Lỗi khi kiểm tra quyền gửi lời mời: ${error.message}`);
  }
};

// Kiểm tra xem người dùng có phải là người tổ chức của sự kiện không
export const checkEventOrganizer = async (userId, eventId) => {
  try {
    const event = await db.Event.findByPk(eventId, {
      attributes: {
        exclude: ["status_action_id"], // Loại bỏ cột gây lỗi
      },
    });
    return event && event.organizer_id === userId;
  } catch (error) {
    throw new Error(`Lỗi khi kiểm tra quyền người tổ chức: ${error.message}`);
  }
};

// Kiểm tra quyền hủy lời mời (chỉ người gửi lời mời hoặc người tổ chức sự kiện mới có quyền hủy)
export const checkCancelPermission = async (userId, invitation) => {
  try {
    // Kiểm tra xem người dùng có phải là người gửi lời mời không
    if (invitation.invited_by === userId) {
      return true;
    }

    // Kiểm tra xem người dùng có phải là người tổ chức của sự kiện không
    const isOrganizer = await checkEventOrganizer(userId, invitation.event_id);
    return isOrganizer;
  } catch (error) {
    throw new Error(`Lỗi khi kiểm tra quyền hủy lời mời: ${error.message}`);
  }
};

// Tạo lời mời tham gia sự kiện
export const createEventInvitation = async (invitationData) => {
  try {
    // Kiểm tra xem người dùng đã là người tham gia của sự kiện chưa
    const isMember = await eventMemberService.checkEventMembership(
      invitationData.invited_to,
      invitationData.event_id
    );
    if (isMember) {
      throw new Error("Người dùng này đã là người tham gia của sự kiện");
    }

    const newInvitation = await db.EventInvitation.create(invitationData);
    return await getEventInvitationById(newInvitation.documentId);
  } catch (error) {
    throw new Error(`Lỗi khi tạo lời mời tham gia sự kiện: ${error.message}`);
  }
};

// Phản hồi lời mời tham gia sự kiện
export const respondToInvitation = async (invitationId, statusActionId) => {
  try {
    const invitation = await db.EventInvitation.findByPk(invitationId, {
      attributes: {
        exclude: ["status_action_id"], // Loại bỏ cột gây lỗi
      },
    });

    if (!invitation) {
      throw new Error("Không tìm thấy lời mời");
    }

    // // Nếu lời mời đã được phản hồi
    // if (invitation.invitation_status) {
    //   throw new Error("Lời mời này đã được phản hồi");
    // }

    // Cập nhật trạng thái lời mời
    await invitation.update({
      invitation_status: statusActionId,
      responded_at: new Date(),
    });

    // Nếu chấp nhận lời mời, thêm người dùng vào sự kiện
    const acceptStatus = await db.StatusAction.findOne({
      where: { name: "accepted" },
      attributes: {
        exclude: ["status_action_id"], // Loại bỏ cột gây lỗi
      },
    });

    if (statusActionId === acceptStatus.documentId) {
      await eventMemberService.addEventMember({
        event_id: invitation.event_id,
        user_id: invitation.invited_to,
        joined_at: new Date(),
      });
    }

    return await getEventInvitationById(invitationId);
  } catch (error) {
    throw new Error(`Lỗi khi phản hồi lời mời: ${error.message}`);
  }
};

// Hủy lời mời tham gia sự kiện
export const cancelInvitation = async (invitationId) => {
  try {
    const invitation = await db.EventInvitation.findByPk(invitationId, {
      attributes: {
        exclude: ["status_action_id"], // Loại bỏ cột gây lỗi
      },
    });

    if (!invitation) {
      throw new Error("Không tìm thấy lời mời");
    }

    // Nếu lời mời đã được phản hồi
    if (invitation.invitation_status) {
      throw new Error("Lời mời này đã được phản hồi, không thể hủy");
    }

    // Xóa lời mời
    await invitation.destroy();
    return { message: "Hủy lời mời thành công" };
  } catch (error) {
    throw new Error(`Lỗi khi hủy lời mời: ${error.message}`);
  }
};

// Lấy danh sách lời mời của một sự kiện
export const getInvitationsByEventId = async (eventId) => {
  try {
    const invitations = await db.EventInvitation.findAll({
      where: { event_id: eventId },

      include: [
        {
          model: db.User,
          as: "inviter",
          attributes: ["documentId", "fullname", "email", "avatar_id"],
        },
        {
          model: db.User,
          as: "invitee",
          attributes: ["documentId", "fullname", "email", "avatar_id"],
        },
        {
          model: db.StatusAction,
          as: "statusAction",
          attributes: ["documentId", "name", "description"],
        },
      ],
      attributes: {
        exclude: ["status_action_id"], // Loại bỏ cột gây lỗi
      },
    });

    return invitations;
  } catch (error) {
    throw new Error(
      `Lỗi khi lấy danh sách lời mời của sự kiện: ${error.message}`
    );
  }
};

// Lấy danh sách lời mời của một người dùng
export const getInvitationsByUserId = async (userId) => {
  try {
    const invitations = await db.EventInvitation.findAll({
      where: { invited_to: userId },
      include: [
        {
          model: db.User,
          as: "inviter",
          attributes: ["documentId", "fullname", "email", "avatar_id"],
        },
        {
          model: db.Event,
          as: "event",
          attributes: ["documentId", "name", "description", "host_id"],
        },
        {
          model: db.StatusAction,
          as: "statusAction",
          attributes: ["documentId", "name", "description"],
        },
      ],
      attributes: {
          exclude: ['status_action_id'] // Loại bỏ cột gây lỗi
        }
    });

    return invitations;
  } catch (error) {
    throw new Error(
      `Lỗi khi lấy danh sách lời mời của người dùng: ${error.message}`
    );
  }
};
