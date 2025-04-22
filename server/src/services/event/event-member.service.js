import db from "../../models";
import { Op } from "sequelize";
import * as eventService from "./event.service";

// Lấy tất cả event-members có phân trang và lọc
export const getAllEventMembers = async ({
  page = 1,
  pageSize = 10,
  sortField = "joined_at",
  sortOrder = "DESC",
  populate = false,
  userId = null,
  eventId = null,
}) => {
  try {
    const offset = (page - 1) * pageSize;
    const whereConditions = {};

    // Lọc theo userId nếu được cung cấp
    if (userId) {
      whereConditions.user_id = userId;
    }

    // Lọc theo eventId nếu được cung cấp
    if (eventId) {
      whereConditions.event_id = eventId;
    }

    // Chuẩn bị các mối quan hệ cần include
    const includes = [];

    if (populate) {
      includes.push(
        {
          model: db.User,
          as: "user",
          attributes: ["documentId", "fullname", "email", "avatar_id"],
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
            "name",
            "description",
            "host_id",
          ],
        }
      );
    }

    // Thực hiện truy vấn
    const { count, rows } = await db.EventMember.findAndCountAll({
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
      `Lỗi khi lấy danh sách người tham gia sự kiện: ${error.message}`
    );
  }
};

// Lấy event-member theo ID
export const getEventMemberById = async (documentId) => {
  try {
    const eventMember = await db.EventMember.findByPk(documentId, {
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["documentId", "fullname", "email", "avatar_id"],
          include: [
            {
              model: db.Media,
              as: "avatarMedia",
              attributes: ["documentId", "file_path", "file_type"],
            },
          ],
        },
        {
          model: db.Event,
          as: "event",
          attributes: [
            "documentId",
            "name",
            "description",
            "host_id",
          ],
          include: [
            {
              model: db.Media,
              as: "image",
              attributes: ["documentId", "file_path"],
            },
          ],
        },
      ],
    });

    if (!eventMember) {
      throw new Error("Không tìm thấy người tham gia sự kiện");
    }

    return eventMember;
  } catch (error) {
    throw new Error(
      `Lỗi khi lấy thông tin người tham gia sự kiện: ${error.message}`
    );
  }
};

// Lấy thông tin event từ service khác
export const getEventById = async (eventId) => {
  try {
    return await eventService.getEventById(eventId);
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông tin sự kiện: ${error.message}`);
  }
};

// Thêm người tham gia vào sự kiện
export const addEventMember = async (memberData) => {
  try {
    //Kiểm tra xem đã tồn tại người tham gia trong sự kiện chưa
    const existingMember = await db.EventMember.findOne({
      where: {
        event_id: memberData.event_id,
        user_id: memberData.user_id,
        status: memberData.status,
      },
    });
    if (existingMember) {
      throw new Error("Người dùng đã tham gia sự kiện này");
    }

    const newEventMember = await db.EventMember.create(memberData);
    return await getEventMemberById(newEventMember.documentId);
  } catch (error) {
    throw new Error(
      `Lỗi khi thêm người tham gia vào sự kiện: ${error.message}`
    );
  }
};

// Xóa người tham gia khỏi sự kiện
export const removeEventMember = async (documentId) => {
  try {
    const eventMember = await db.EventMember.findByPk(documentId);

    if (!eventMember) {
      throw new Error("Không tìm thấy người tham gia sự kiện");
    }

    // Kiểm tra xem người tham gia này có phải là người tổ chức của sự kiện không
    const event = await db.Event.findByPk(eventMember.event_id);

    if (event && event.organizer_id === eventMember.user_id) {
      throw new Error(
        "Không thể xóa người tổ chức ra khỏi sự kiện. Hãy chuyển quyền tổ chức trước khi rời sự kiện."
      );
    }

    await eventMember.destroy();
    return { message: "Xóa người tham gia khỏi sự kiện thành công" };
  } catch (error) {
    throw new Error(
      `Lỗi khi xóa người tham gia khỏi sự kiện: ${error.message}`
    );
  }
};

// Lấy danh sách người tham gia của một sự kiện
export const getEventMembersByEventId = async (eventId) => {
  try {
    const members = await db.EventMember.findAll({
      where: { event_id: eventId },
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["documentId", "fullname", "email", "avatar_id"],
          include: [
            {
              model: db.Media,
              as: "avatarMedia",
              attributes: ["documentId", "file_path", "file_type"],
            },
          ],
        },
      ],
    });

    return members;
  } catch (error) {
    throw new Error(
      `Lỗi khi lấy danh sách người tham gia của sự kiện: ${error.message}`
    );
  }
};

// Lấy danh sách sự kiện mà một người dùng tham gia
export const getEventMembersByUserId = async (userId) => {
  try {
    const memberships = await db.EventMember.findAll({
      where: { user_id: userId },
      include: [
        {
          model: db.Event,
          as: "event",
          include: [
            {
              model: db.User,
              as: "organizer",
              attributes: ["documentId", "fullname", "email", "avatar_id"],
              include: [
                {
                  model: db.Media,
                  as: "avatarMedia",
                  attributes: ["documentId", "file_path", "file_type"],
                },
              ],
            },
            {
              model: db.Media,
              as: "image",
              attributes: ["documentId", "url", "type"],
            },
          ],
        },
      ],
    });

    return memberships;
  } catch (error) {
    throw new Error(
      `Lỗi khi lấy danh sách sự kiện của người dùng: ${error.message}`
    );
  }
};

// Kiểm tra xem một người dùng có tham gia một sự kiện hay không
export const checkEventMembership = async (userId, eventId) => {
  try {
    const membership = await db.EventMember.findOne({
      where: {
        event_id: eventId,
        user_id: userId,
      },
    });

    return !!membership; // Trả về true nếu tìm thấy, false nếu không tìm thấy
  } catch (error) {
    throw new Error(
      `Lỗi khi kiểm tra người tham gia sự kiện: ${error.message}`
    );
  }
};
