import * as eventRequestService from "../../services/event/event-request.service.js";

export const getAllEventRequests = async (req, res) => {
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
    const statusId = req.query.statusId || null;

    // Gọi service để lấy danh sách yêu cầu tham gia sự kiện
    const requestsData = await eventRequestService.getAllEventRequests({
      page,
      pageSize,
      sortField,
      sortOrder,
      populate,
      userId,
      eventId,
      statusId,
    });

    // Trả về kết quả
    return res.status(200).json(requestsData);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: "Lỗi từ server: " + error.message,
    });
  }
};

export const getEventRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await eventRequestService.getEventRequestById(id);

    return res.status(200).json({
      err: 0,
      message: "Lấy thông tin yêu cầu tham gia sự kiện thành công",
      data: request,
    });
  } catch (error) {
    return res.status(404).json({
      err: -1,
      message: error.message,
    });
  }
};

export const createEventRequest = async (req, res) => {
  try {
    const { eventId, requestBy, statusActionId } = req.body;

    // Kiểm tra xem eventId có được cung cấp không
    if (!eventId) {
      return res.status(400).json({
        err: -1,
        message: "Thiếu thông tin cần thiết (eventId)",
      });
    }

    const newRequest = await eventRequestService.createEventRequest({
      event_id: eventId,
      user_request: requestBy,
      request_status: statusActionId,
      created_at: new Date(),
    });

    return res.status(201).json({
      err: 0,
      message: "Gửi yêu cầu tham gia sự kiện thành công",
      data: newRequest,
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: "Lỗi từ server: " + error.message,
    });
  }
};

export const respondToRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { statusActionId } = req.body;

    // Lấy thông tin yêu cầu
    const request = await eventRequestService.getEventRequestById(id);

    const result = await eventRequestService.respondToRequest(
      id,
      statusActionId
    );

    return res.status(200).json({
      err: 0,
      message: "Phản hồi yêu cầu tham gia sự kiện thành công",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: error.message,
    });
  }
};

export const cancelRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy thông tin yêu cầu
    const request = await eventRequestService.getEventRequestById(id);

    const result = await eventRequestService.cancelRequest(id);

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

export const getRequestsByEventId = async (req, res) => {
  try {
    const { eventId } = req.params;

    const requests = await eventRequestService.getRequestsByEventId(eventId);

    return res.status(200).json({
      err: 0,
      message: "Lấy danh sách yêu cầu tham gia sự kiện thành công",
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: error.message,
    });
  }
};

export const getRequestsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const requests = await eventRequestService.getRequestsByUserId(userId);

    return res.status(200).json({
      err: 0,
      message:
        "Lấy danh sách yêu cầu tham gia sự kiện của người dùng thành công",
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: error.message,
    });
  }
};

export const getPendingRequestCount = async (req, res) => {
  try {
    const { eventId } = req.params;

    const count = await eventRequestService.getPendingRequestCount(eventId);

    return res.status(200).json({
      err: 0,
      message: "Lấy số lượng yêu cầu đang chờ xử lý thành công",
      data: { count },
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: error.message,
    });
  }
};
