"use strict";
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Kiểm tra xem đã có dữ liệu trong bảng Users chưa
      const existingUsers = await queryInterface.sequelize
        .query("SELECT * FROM Users LIMIT 1", {
          type: queryInterface.sequelize.QueryTypes.SELECT,
        })
        .catch((err) => {
          console.log("Lỗi khi kiểm tra bảng Users:", err.message);
          return [];
        });

      // Nếu đã có dữ liệu, không thêm nữa
      if (existingUsers.length > 0) {
        console.log("Bảng Users đã có dữ liệu, bỏ qua seeding.");
        return;
      }

      // Lấy Role ID từ env hoặc từ bảng Roles
      let userRoleId = process.env.ROLE_USER_ID;
      let adminRoleId = process.env.ROLE_ADMIN_ID;

      if (!userRoleId || !adminRoleId) {
        try {
          const roles = await queryInterface.sequelize.query(
            "SELECT documentId, roleName FROM Roles",
            { type: queryInterface.sequelize.QueryTypes.SELECT }
          );

          if (roles.length > 0) {
            const userRole = roles.find((role) => role.roleName === "User");
            const adminRole = roles.find((role) => role.roleName === "Admin");

            if (userRole) userRoleId = userRole.documentId;
            if (adminRole) adminRoleId = adminRole.documentId;
          }
        } catch (error) {
          console.log("Không thể lấy role_id cho user:", error.message);
        }
      }

      // Lấy StatusActivity ID mặc định
      let statusId = null;
      try {
        const statuses = await queryInterface.sequelize.query(
          'SELECT documentId FROM StatusActivities WHERE name = "Online" LIMIT 1',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        if (statuses.length > 0) {
          statusId = statuses[0].documentId;
        }
      } catch (error) {
        console.log("Không thể lấy status_id cho user:", error.message);
      }

      // Lấy Nation ID mặc định
      let nationId = process.env.NATION_VN_ID;
      if (!nationId) {
        try {
          const nations = await queryInterface.sequelize.query(
            'SELECT documentId FROM Nations WHERE name = "Việt Nam" LIMIT 1',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
          );
          if (nations.length > 0) {
            nationId = nations[0].documentId;
          }
        } catch (error) {
          console.log("Không thể lấy nation_id cho user:", error.message);
        }
      }

      // Lấy Media ID cho avatar và cover photo
      let avatarId = process.env.DEFAULT_AVATAR_ID;
      let coverPhotoId = process.env.DEFAULT_COVER_PHOTO_ID;

      if (!avatarId || !coverPhotoId) {
        try {
          const medias = await queryInterface.sequelize.query(
            "SELECT documentId FROM Medias LIMIT 2",
            { type: queryInterface.sequelize.QueryTypes.SELECT }
          );

          if (medias.length > 0) {
            avatarId = medias[0].documentId;
            if (medias.length > 1) {
              coverPhotoId = medias[1].documentId;
            }
          }
        } catch (error) {
          console.log("Không thể lấy media_id cho user:", error.message);
        }
      }

      // Lấy User Type ID từ env hoặc từ bảng Types
      let userTypeId = process.env.USER_TYPE_ID;

      if (!userTypeId) {
        try {
          const types = await queryInterface.sequelize.query(
            'SELECT documentId FROM Types WHERE name = "User Type" LIMIT 1',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
          );

          if (types.length > 0) {
            userTypeId = types[0].documentId;
          }
        } catch (error) {
          console.log("Không thể lấy type_id cho user:", error.message);
        }
      }

      // Mã hóa mật khẩu
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync("Password123!", salt);

      // Tạo dữ liệu mẫu cho Users
      const user1Id = uuidv4();
      const user2Id = uuidv4();
      const adminId = uuidv4();

      // Lưu user IDs vào env để sử dụng cho các models khác
      process.env.USER_1_ID = user1Id;
      process.env.USER_2_ID = user2Id;
      process.env.ADMIN_ID = adminId;

      const users = [
        {
          documentId: user1Id,
          fullname: "Nguyen Van A",
          username: "user1",
          email: "user1@example.com",
          password: hashedPassword,
          date_of_birth: new Date(1990, 0, 1),
          gender: "male",
          role_id: userRoleId,
          status_id: statusId,
          type_id: userTypeId,
          nation_id: nationId,
          last_active: new Date(),
          avatar_id: avatarId,
          cover_photo_id: coverPhotoId,
          is_online: true,
          is_blocked: false,
          about: "Tôi là người dùng 1",
          email_verified: true,
          refresh_token: null,
          refresh_token_expires: null,
          phone: "0123456789",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          documentId: user2Id,
          fullname: "Tran Thi B",
          username: "user2",
          email: "user2@example.com",
          password: hashedPassword,
          date_of_birth: new Date(1992, 2, 15),
          gender: "female",
          role_id: userRoleId,
          status_id: statusId,
          type_id: userTypeId,
          nation_id: nationId,
          last_active: new Date(),
          avatar_id: avatarId,
          cover_photo_id: coverPhotoId,
          is_online: true,
          is_blocked: false,
          about: "Tôi là người dùng 2",
          email_verified: true,
          refresh_token: null,
          refresh_token_expires: null,
          phone: "0987654321",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          documentId: adminId,
          fullname: "Admin User",
          username: "admin",
          email: "admin@example.com",
          password: hashedPassword,
          date_of_birth: new Date(1985, 5, 25),
          gender: "other",
          role_id: adminRoleId,
          status_id: statusId,
          type_id: userTypeId,
          nation_id: nationId,
          last_active: new Date(),
          avatar_id: avatarId,
          cover_photo_id: coverPhotoId,
          is_online: true,
          is_blocked: false,
          about: "Tôi là quản trị viên",
          email_verified: true,
          refresh_token: null,
          refresh_token_expires: null,
          phone: "0909123456",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Thêm dữ liệu vào bảng Users
      await queryInterface.bulkInsert("Users", users, {});
      console.log("Đã thêm dữ liệu vào bảng Users");
    } catch (error) {
      console.error("Lỗi khi seed Users:", error.message);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
