import express from "express";
import * as eventMemberController from "../../controllers/event/event-member.js";
import { verifyToken } from "../../middlewares/auth.js";

const router = express.Router();

// Lấy tất cả người tham gia sự kiện (có phân trang, lọc)
router.get("/", eventMemberController.getAllEventMembers);

// Lấy người tham gia sự kiện theo ID
router.get("/:id", eventMemberController.getEventMemberById);

// Thêm người tham gia vào sự kiện (yêu cầu đăng nhập)
router.post("/", verifyToken, eventMemberController.addEventMember);

// Xóa người tham gia khỏi sự kiện (yêu cầu đăng nhập)
router.delete("/:id", verifyToken, eventMemberController.removeEventMember);

// Lấy danh sách người tham gia của một sự kiện
router.get("/event/:eventId", eventMemberController.getEventMembersByEventId);

// Lấy danh sách sự kiện mà một người dùng tham gia
router.get("/user/:userId", eventMemberController.getEventMembersByUserId);

// Kiểm tra xem một người dùng có tham gia sự kiện hay không
router.get(
  "/check/:userId/:eventId",
  eventMemberController.checkEventMembership
);

export default router;
