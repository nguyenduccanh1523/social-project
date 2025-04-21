import * as eventService from "../../services/event/event.service";

export const getAllEvents = async (req, res) => {
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

    // Xây dựng bộ lọc từ query params
    const filters = {};
    if (req.query.event_name) filters.event_name = req.query.event_name;
    if (req.query.keyword) filters.keyword = req.query.keyword;
    if (req.query.type_id) filters.type_id = req.query.type_id;

    // Lấy userId từ query
    const userId = req.query.userId || null;
    const organizerId = req.query.organizerId || null;

    // Gọi service để lấy danh sách sự kiện
    const eventsData = await eventService.getAllEvents({
      page,
      pageSize,
      filters,
      sortField,
      sortOrder,
      populate,
      userId,
      organizerId,
    });

    // Trả về kết quả
    return res.status(200).json(eventsData);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: "Lỗi từ server: " + error.message,
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await eventService.getEventById(id);

    return res.status(200).json({
      err: 0,
      message: "Lấy thông tin sự kiện thành công",
      data: event,
    });
  } catch (error) {
    return res.status(404).json({
      err: -1,
      message: error.message,
    });
  }
};

export const createEvent = async (req, res) => {
  try {
    const eventData = req.body;

    // Lấy ID của người tạo sự kiện từ token (người đăng nhập)
    if (!eventData.organizer_id) {
      eventData.organizer_id = req.user.documentId;
    }

    const newEvent = await eventService.createEvent(eventData);

    return res.status(201).json({
      err: 0,
      message: "Tạo sự kiện mới thành công",
      data: newEvent,
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: error.message,
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const eventData = req.body;

    // Kiểm tra quyền cập nhật (chỉ người tổ chức của sự kiện mới có quyền cập nhật)
    const event = await eventService.getEventById(id);

    if (event.organizer_id !== req.user.documentId) {
      return res.status(403).json({
        err: -1,
        message: "Bạn không có quyền cập nhật sự kiện này",
      });
    }

    const updatedEvent = await eventService.updateEvent(id, eventData);

    return res.status(200).json({
      err: 0,
      message: "Cập nhật sự kiện thành công",
      data: updatedEvent,
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: error.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra quyền xóa (chỉ người tổ chức của sự kiện mới có quyền xóa)
    const event = await eventService.getEventById(id);

    if (event.organizer_id !== req.user.documentId) {
      return res.status(403).json({
        err: -1,
        message: "Bạn không có quyền xóa sự kiện này",
      });
    }

    const result = await eventService.deleteEvent(id);

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

export const getEventsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const events = await eventService.getEventsByUserId(userId);

    return res.status(200).json({
      err: 0,
      message: "Lấy danh sách sự kiện của người dùng thành công",
      data: events,
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: error.message,
    });
  }
};

export const getEventsOrganizerByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const events = await eventService.getEventsOrganizerByUserId(userId);

    return res.status(200).json({
      err: 0,
      message: "Lấy danh sách sự kiện do người dùng tổ chức thành công",
      data: events,
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: error.message,
    });
  }
};
