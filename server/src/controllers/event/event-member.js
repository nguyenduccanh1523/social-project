import * as eventMemberService from "../../services/event/event-member.service";

export const getAllEventMembers = async (req, res) => {
  try {
    // Lấy tham số phân trang từ query
    const pagination = req.query.pagination || {};
    const page = parseInt(pagination.page) || parseInt(req.query.page) || 1;
    const pageSize =
      parseInt(pagination.pageSize) || parseInt(req.query.pageSize) || 10;

    // Xử lý tham số sort
    const sort = req.query.sort;
    let sortField = "createdAt";
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
    const userId = req.query.userId || null;
    const eventId = req.query.eventId || null;

    // Gọi service để lấy danh sách người tham gia sự kiện
    const eventMembersData = await eventMemberService.getAllEventMembers({
      page,
      pageSize,
      sortField,
      sortOrder,
      populate,
      userId,
      eventId,
    });

    // Trả về kết quả
    return res.status(200).json(eventMembersData);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: "Lỗi từ server: " + error.message,
    });
  }
};

export const getEventMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const eventMember = await eventMemberService.getEventMemberById(id);

    return res.status(200).json({
      err: 0,
      message: "Lấy thông tin người tham gia sự kiện thành công",
      data: eventMember,
    });
  } catch (error) {
    return res.status(404).json({
      err: -1,
      message: error.message,
    });
  }
};

export const addEventMember = async (req, res) => {
  try {
    const { eventId, userId, status } = req.body;

    // Kiểm tra xem eventId và userId có được cung cấp không
    if (!eventId || !userId) {
      return res.status(400).json({
        err: -1,
        message: "Thiếu thông tin cần thiết (eventId hoặc userId)",
      });
    }

    const newEventMember = await eventMemberService.addEventMember({
      event_id: eventId,
      user_id: userId,
      status: status,
    });

    return res.status(201).json({
      err: 0,
      message: "Thêm người tham gia vào sự kiện thành công",
      data: newEventMember,
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: "Lỗi từ server: " + error.message,
    });
  }
};

export const removeEventMember = async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy thông tin người tham gia sự kiện
    // const eventMember = await eventMemberService.getEventMemberById(id);

    const result = await eventMemberService.removeEventMember(id);

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

export const getEventMembersByEventId = async (req, res) => {
  try {
    const { eventId } = req.params;

    const members = await eventMemberService.getEventMembersByEventId(eventId);

    return res.status(200).json({
      err: 0,
      message: "Lấy danh sách người tham gia sự kiện thành công",
      data: members,
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: error.message,
    });
  }
};

export const getEventMembersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const memberships = await eventMemberService.getEventMembersByUserId(
      userId
    );

    return res.status(200).json({
      err: 0,
      message: "Lấy danh sách sự kiện của người dùng thành công",
      data: memberships,
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: error.message,
    });
  }
};

export const checkEventMembership = async (req, res) => {
  try {
    const { userId, eventId } = req.params;

    const isMember = await eventMemberService.checkEventMembership(
      userId,
      eventId
    );

    return res.status(200).json({
      err: 0,
      message: "Kiểm tra người tham gia sự kiện thành công",
      data: { isMember },
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: error.message,
    });
  }
};
