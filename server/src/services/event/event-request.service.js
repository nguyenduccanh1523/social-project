import db from "../../models";
import { Op } from "sequelize";
import * as eventMemberService from "./event-member.service";

// Lấy tất cả event-requests có phân trang và lọc
export const getAllEventRequests = async ({
  page = 1,
  pageSize = 10,
  sortField = "createdAt",
  sortOrder = "DESC",
  populate = false,
  userId = null,
  eventId = null,
  statusId = null,
}) => {
  try {
    const offset = (page - 1) * pageSize;
    const whereConditions = {};

    // Lọc theo userId nếu được cung cấp
    if (userId) {
      whereConditions.user_request = userId;
    }

    // Lọc theo eventId nếu được cung cấp
    if (eventId) {
      whereConditions.event_id = eventId;
    }

    // Lọc theo statusId nếu được cung cấp
    if (statusId) {
      whereConditions.status_action_id = statusId;
    }

    // Chuẩn bị các mối quan hệ cần include
    const includes = [];

    if (populate) {
      includes.push(
        {
          model: db.User,
          as: "user",
          attributes: ["documentId", "fullname", "email"],
          include: [
            {
              model: db.Media,
              as: "avatarMedia",
              attributes: ["documentId", "file_path"],
            },
          ],
        },
        {
          model: db.Event,
          as: "event",
          attributes: [
            "documentId",
            "event_name",
            "description",
            "organizer_id",
          ],
        },
        {
          model: db.StatusAction,
          as: "statusAction",
          attributes: ["documentId", "name", "description"],
        }
      );
    }

    // Thực hiện truy vấn
    const { count, rows } = await db.event_request.findAndCountAll({
      where: whereConditions,
      include: includes,
      order: [[sortField, sortOrder]],
      offset,
      limit: pageSize,
      distinct: true,
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
      `Lỗi khi lấy danh sách yêu cầu tham gia sự kiện: ${error.message}`
    );
  }
};

// Lấy event-request theo ID
export const getEventRequestById = async (documentId) => {
  try {
    const request = await db.event_request.findByPk(documentId, {
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["documentId", "fullname", "email"],
          include: [
            {
              model: db.Media,
              as: "avatarMedia",
              attributes: ["documentId", "file_path"],
            },
          ],
        },
        {
          model: db.Event,
          as: "event",
          attributes: [
            "documentId",
            "event_name",
            "description",
            "organizer_id",
          ],
        },
        {
          model: db.StatusAction,
          as: "statusAction",
          attributes: ["documentId", "name", "description"],
        },
      ],
    });

    if (!request) {
      throw new Error("Không tìm thấy yêu cầu tham gia sự kiện");
    }

    return request;
  } catch (error) {
    throw new Error(
      `Lỗi khi lấy thông tin yêu cầu tham gia sự kiện: ${error.message}`
    );
  }
};

// Kiểm tra xem người dùng có phải là người tổ chức của sự kiện không
export const checkEventOrganizer = async (userId, eventId) => {
  try {
    const event = await db.Event.findByPk(eventId);
    return event && event.organizer_id === userId;
  } catch (error) {
    throw new Error(`Lỗi khi kiểm tra quyền người tổ chức: ${error.message}`);
  }
};

// Tạo yêu cầu tham gia sự kiện
export const createEventRequest = async (requestData) => {
  try {
    // Kiểm tra xem người dùng đã có yêu cầu tham gia sự kiện này chưa
    const existingRequest = await db.event_request.findOne({
      where: {
        event_id: requestData.event_id,
        user_request: requestData.user_request,
      },
    });

    if (existingRequest) {
      throw new Error(
        "Bạn đã gửi yêu cầu tham gia sự kiện này và đang chờ xử lý"
      );
    }

    // Kiểm tra xem người dùng đã là người tham gia của sự kiện chưa
    const isMember = await eventMemberService.checkEventMembership(
      requestData.user_request,
      requestData.event_id
    );
    if (isMember) {
      throw new Error("Bạn đã tham gia sự kiện này");
    }

    const newRequest = await db.event_request.create(requestData);
    return await getEventRequestById(newRequest.documentId);
  } catch (error) {
    throw new Error(`Lỗi khi tạo yêu cầu tham gia sự kiện: ${error.message}`);
  }
};

// Phản hồi yêu cầu tham gia sự kiện
export const respondToRequest = async (requestId, statusActionId) => {
  try {
    const request = await db.event_request.findByPk(requestId);

    if (!request) {
      throw new Error("Không tìm thấy yêu cầu tham gia sự kiện");
    }

    // Cập nhật trạng thái yêu cầu
    await request.update({
      status_action_id: statusActionId,
    });

    // Nếu chấp nhận yêu cầu, thêm người dùng vào sự kiện
    const acceptStatus = await db.StatusAction.findOne({
      where: { name: "accepted" },
    });

    if (statusActionId === acceptStatus.documentId) {
      await eventMemberService.addEventMember({
        event_id: request.event_id,
        user_id: request.user_request,
        joined_at: new Date(),
      });
    }

    return await getEventRequestById(requestId);
  } catch (error) {
    throw new Error(
      `Lỗi khi phản hồi yêu cầu tham gia sự kiện: ${error.message}`
    );
  }
};

// Hủy yêu cầu tham gia sự kiện
export const cancelRequest = async (requestId) => {
  try {
    const request = await db.event_request.findByPk(requestId);

    if (!request) {
      throw new Error("Không tìm thấy yêu cầu tham gia sự kiện");
    }

    // Nếu yêu cầu đã được phản hồi
    if (request.status_action_id) {
      throw new Error("Yêu cầu này đã được phản hồi, không thể hủy");
    }

    // Xóa yêu cầu
    await request.destroy();
    return { message: "Hủy yêu cầu tham gia sự kiện thành công" };
  } catch (error) {
    throw new Error(`Lỗi khi hủy yêu cầu tham gia sự kiện: ${error.message}`);
  }
};

// Lấy danh sách yêu cầu tham gia một sự kiện
export const getRequestsByEventId = async (eventId) => {
  try {
    const requests = await db.event_request.findAll({
      where: { event_id: eventId },
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["documentId", "fullname", "email"],
          include: [
            {
              model: db.Media,
              as: "avatarMedia",
              attributes: ["documentId", "file_path"],
            },
          ],
        },
        {
          model: db.StatusAction,
          as: "statusAction",
          attributes: ["documentId", "name", "description"],
        },
      ],
    });

    return requests;
  } catch (error) {
    throw new Error(
      `Lỗi khi lấy danh sách yêu cầu tham gia sự kiện: ${error.message}`
    );
  }
};

// Lấy danh sách yêu cầu tham gia sự kiện của một người dùng
export const getRequestsByUserId = async (userId) => {
  try {
    const requests = await db.event_request.findAll({
      where: { user_request: userId },
      include: [
        {
          model: db.Event,
          as: "event",
          attributes: [
            "documentId",
            "event_name",
            "description",
            "organizer_id",
          ],
        },
        {
          model: db.StatusAction,
          as: "statusAction",
          attributes: ["documentId", "name", "description"],
        },
      ],
    });

    return requests;
  } catch (error) {
    throw new Error(
      `Lỗi khi lấy danh sách yêu cầu tham gia sự kiện của người dùng: ${error.message}`
    );
  }
};

// Lấy số lượng yêu cầu đang chờ xử lý của một sự kiện
export const getPendingRequestCount = async (eventId) => {
  try {
    const count = await db.event_request.count({
      where: {
        event_id: eventId,
        status_action_id: null,
      },
    });

    return count;
  } catch (error) {
    throw new Error(
      `Lỗi khi lấy số lượng yêu cầu đang chờ xử lý: ${error.message}`
    );
  }
};
