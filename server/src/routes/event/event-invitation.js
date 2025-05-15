import express from "express";
import * as eventInvitationController from "../../controllers/event/event-invitation.js";
import { verifyToken } from "../../middlewares/auth.js";

const router = express.Router();

// Lấy tất cả lời mời tham gia sự kiện (có phân trang, lọc)
router.get("/", eventInvitationController.getAllEventInvitations);

// Lấy lời mời tham gia sự kiện theo ID
router.get("/:id", eventInvitationController.getEventInvitationById);

// Tạo lời mời tham gia sự kiện (yêu cầu đăng nhập)
router.post("/", verifyToken, eventInvitationController.createEventInvitation);

// Phản hồi lời mời tham gia sự kiện (yêu cầu đăng nhập)
router.put(
  "/:id/respond",
  verifyToken,
  eventInvitationController.respondToInvitation
);

// Hủy lời mời tham gia sự kiện (yêu cầu đăng nhập)
router.delete("/:id", verifyToken, eventInvitationController.cancelInvitation);

// Lấy danh sách lời mời của một sự kiện (yêu cầu đăng nhập)
router.get(
  "/event/:eventId",
  verifyToken,
  eventInvitationController.getInvitationsByEventId
);

// Lấy danh sách lời mời của một người dùng (yêu cầu đăng nhập)
router.get(
  "/user/:userId",
  verifyToken,
  eventInvitationController.getInvitationsByUserId
);

export default router;
