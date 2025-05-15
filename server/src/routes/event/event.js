import express from "express";
import * as eventController from "../../controllers/event/event.js";
import { verifyToken } from "../../middlewares/auth.js";

const router = express.Router();

// Lấy tất cả sự kiện (có phân trang, lọc)
router.get("/", verifyToken, eventController.getAllEvents);

// Lấy sự kiện theo ID
router.get("/:id", verifyToken, eventController.getEventById);

// Tạo sự kiện mới (yêu cầu đăng nhập)
router.post("/", verifyToken, eventController.createEvent);

// Cập nhật sự kiện (yêu cầu đăng nhập)
router.put("/:id", verifyToken, eventController.updateEvent);

// Xóa sự kiện (yêu cầu đăng nhập)
router.delete("/:id", verifyToken, eventController.deleteEvent);

// Lấy danh sách sự kiện mà user tham gia
router.get("/user/:userId", verifyToken, eventController.getEventsByUserId);

// Lấy danh sách sự kiện mà user là người tổ chức
router.get(
  "/organizer/:userId",
  verifyToken,
  eventController.getEventsOrganizerByUserId
);

export default router;
