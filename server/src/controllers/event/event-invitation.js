import * as eventInvitationService from "../../services/event/event-invitation.service";

export const getAllEventInvitations = async (req, res) => {
  try {
    // Lấy tham số phân trang từ query
    const pagination = req.query.pagination || {};
    const page = parseInt(pagination.page) || parseInt(req.query.page) || 1;
    const pageSize =
      parseInt(pagination.pageSize) || parseInt(req.query.pageSize) || 10;

    // Xử lý tham số sort
    const sort = req.query.sort;
    let sortField = "created_at";
    let sortOrder = "DESC";

    if (sort) {
      const sortParts = sort.split(":");
      if (sortParts.length === 2) {
        sortField = sortParts[0];
        sortOrder = sortParts[1].toUpperCase();
      }
    }

    // Xử lý populate
    const populate = req.query.populate === "*" ? true : false;

    // Lấy các tham số lọc
    const invitedBy = req.query.invitedBy || null;
    const invitedTo = req.query.invitedTo || null;
    const eventId = req.query.eventId || null;
    const statusId = req.query.statusId || null;

    // Gọi service để lấy danh sách lời mời vào sự kiện
    const invitationsData = await eventInvitationService.getAllEventInvitations(
      {
        page,
        pageSize,
        sortField,
        sortOrder,
        populate,
        invitedBy,
        invitedTo,
        eventId,
        statusId,
      }
    );

    // Trả về kết quả
    return res.status(200).json(invitationsData);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: "Lỗi từ server: " + error.message,
    });
  }
};

export const getEventInvitationById = async (req, res) => {
  try {
    const { id } = req.params;
    const invitation = await eventInvitationService.getEventInvitationById(id);

    return res.status(200).json({
      err: 0,
      message: "Lấy thông tin lời mời thành công",
      data: invitation,
    });
  } catch (error) {
    return res.status(404).json({
      err: -1,
      message: error.message,
    });
  }
};

export const createEventInvitation = async (req, res) => {
  try {
    const { eventId, invitedTo, invitedBy, statusActionId } = req.body;

    // Kiểm tra xem eventId và invitedTo có được cung cấp không
    if (!eventId || !invitedTo || !invitedBy) {
      return res.status(400).json({
        err: -1,
        message:
          "Thiếu thông tin cần thiết (eventId hoặc invitedTo hoặc invitedBy)",
      });
    }

    // Lấy ID của người gửi lời mời từ token (người đăng nhập)
    // const invitedBy = req.user.documentId;

    const newInvitation = await eventInvitationService.createEventInvitation({
      event_id: eventId,
      invited_by: invitedBy,
      invited_to: invitedTo,
      invitation_status: statusActionId,
    });

    return res.status(201).json({
      err: 0,
      message: "Gửi lời mời vào sự kiện thành công",
      data: newInvitation,
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: "Lỗi từ server: " + error.message,
    });
  }
};

export const respondToInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const { statusActionId } = req.body;

    // Lấy thông tin lời mời
    const invitation = await eventInvitationService.getEventInvitationById(id);

    const result = await eventInvitationService.respondToInvitation(
      id,
      statusActionId
    );

    return res.status(200).json({
      err: 0,
      message: "Phản hồi lời mời thành công",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: error.message,
    });
  }
};

export const cancelInvitation = async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy thông tin lời mời
    const invitation = await eventInvitationService.getEventInvitationById(id);

    const result = await eventInvitationService.cancelInvitation(id);

    return res.status(200).json({
      err: 0,
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: error.message,
    });
  }
};

export const getInvitationsByEventId = async (req, res) => {
  try {
    const { eventId } = req.params;

    const invitations = await eventInvitationService.getInvitationsByEventId(
      eventId
    );

    return res.status(200).json({
      err: 0,
      message: "Lấy danh sách lời mời của sự kiện thành công",
      data: invitations,
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: error.message,
    });
  }
};

export const getInvitationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const invitations = await eventInvitationService.getInvitationsByUserId(
      userId
    );

    return res.status(200).json({
      err: 0,
      message: "Lấy danh sách lời mời của người dùng thành công",
      data: invitations,
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: error.message,
    });
  }
};
