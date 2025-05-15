import db from "../../models/index.js";
import { Op } from "sequelize";

// Lấy tất cả events có phân trang và lọc
export const getAllEvents = async ({
  page = 1,
  pageSize = 10,
  filters = {},
  sortField = "createdAt",
  sortOrder = "DESC",
  populate = false,
  userId = null,
  host_id = null,
}) => {
  try {
    const offset = (page - 1) * pageSize;
    const whereConditions = {};

    // Áp dụng các bộ lọc nếu có
    if (filters.event_name) {
      whereConditions.event_name = { [Op.like]: `%${filters.event_name}%` };
    }

    if (filters.type_id) {
      whereConditions.type_id = filters.type_id;
    }

    if (filters.keyword) {
      whereConditions[Op.or] = [
        { name: { [Op.like]: `%${filters.keyword}%` } },
        { description: { [Op.like]: `%${filters.keyword}%` } },
      ];
    }

    // Nếu có organizerId, tìm sự kiện có organizer_id bằng organizerId
    if (host_id) {
      whereConditions.host_id = host_id;
    }

    // Chuẩn bị các mối quan hệ cần include
    const includes = [];

    if (populate) {
      includes.push(
        {
          model: db.User,
          as: "host",
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
          attributes: ["documentId", "file_path"],
        },
        {
          model: db.EventMember,
          as: "members",
          include: [
            {
              model: db.User,
              as: "user",
              attributes: ["documentId", "fullname", "email", "avatar_id"],
            }
          ]
        }
      );
    }

    // Nếu có userId, lọc theo các sự kiện mà user đó tham gia
    let query = {};
    if (userId) {
      query = {
        include: [
          ...includes,
          {
            model: db.User,
            as: "users",
            where: { documentId: userId },
            attributes: [],
          },
        ],
        where: whereConditions,
        order: [[sortField, sortOrder]],
        offset,
        limit: pageSize,
        distinct: true,
      };
    } else {
      query = {
        include: includes,
        where: whereConditions,
        order: [[sortField, sortOrder]],
        offset,
        limit: pageSize,
        distinct: true,
      };
    }

    // Thực hiện truy vấn
    const { count, rows } = await db.Event.findAndCountAll(query);

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
    throw new Error(`Lỗi khi lấy danh sách sự kiện: ${error.message}`);
  }
};

// Lấy event theo ID
export const getEventById = async (documentId) => {
  try {
    const event = await db.Event.findByPk(documentId, {
      include: [
        {
          model: db.User,
          as: "host",
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
          attributes: ["documentId", "file_path"],
        },
        {
          model: db.EventMember,
          as: "members",
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
        },
      ],
    });

    if (!event) {
      throw new Error("Không tìm thấy sự kiện");
    }

    return event;
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông tin sự kiện: ${error.message}`);
  }
};

// Tạo event mới
export const createEvent = async (eventData) => {
  try {
    const newEvent = await db.Event.create(eventData);

    // Tự động thêm người tạo sự kiện vào danh sách người tham gia
    await db.event_members.create({
      user_id: eventData.host_id,
      event_id: newEvent.documentId,
      joined_at: new Date(),
    });

    return await getEventById(newEvent.documentId);
  } catch (error) {
    throw new Error(`Lỗi khi tạo sự kiện mới: ${error.message}`);
  }
};

// Cập nhật event
export const updateEvent = async (documentId, eventData) => {
  try {
    const event = await db.Event.findByPk(documentId);

    if (!event) {
      throw new Error("Không tìm thấy sự kiện");
    }

    await event.update(eventData);
    return await getEventById(documentId);
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật sự kiện: ${error.message}`);
  }
};

// Xóa event
export const deleteEvent = async (documentId) => {
  try {
    const event = await db.Event.findByPk(documentId);

    if (!event) {
      throw new Error("Không tìm thấy sự kiện");
    }

    // Xóa các người tham gia, yêu cầu, lời mời liên quan đến sự kiện
    await db.event_members.destroy({ where: { event_id: documentId } });
    await db.event_request.destroy({ where: { event_id: documentId } });
    await db.event_invitation.destroy({ where: { event_id: documentId } });

    // Xóa sự kiện
    await event.destroy();

    return { message: "Xóa sự kiện thành công" };
  } catch (error) {
    throw new Error(`Lỗi khi xóa sự kiện: ${error.message}`);
  }
};

// Lấy các sự kiện mà một người dùng tham gia
export const getEventsByUserId = async (userId) => {
  try {
    const events = await db.Event.findAll({
      include: [
        {
          model: db.User,
          as: "users",
          where: { documentId: userId },
          attributes: [],
        },
        {
          model: db.User,
          as: "organizer",
          attributes: ["documentId", "fullname", "email"],
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
          attributes: ["documentId", "file_path"],
        },
      ],
    });

    return events;
  } catch (error) {
    throw new Error(
      `Lỗi khi lấy danh sách sự kiện của người dùng: ${error.message}`
    );
  }
};

// Lấy các sự kiện mà một người dùng là người tổ chức
export const getEventsOrganizerByUserId = async (userId) => {
  try {
    const events = await db.Event.findAll({
      where: { organizer_id: userId },
      include: [
        {
          model: db.Media,
          as: "image",
          attributes: ["documentId", "file_path"],
        },
        {
          model: db.event_members,
          as: "members",
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
        },
      ],
    });

    return events;
  } catch (error) {
    throw new Error(
      `Lỗi khi lấy danh sách sự kiện do người dùng tổ chức: ${error.message}`
    );
  }
};
