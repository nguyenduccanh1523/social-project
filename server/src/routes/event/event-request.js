import express from "express";
import * as eventRequestController from "../../controllers/event/event-request.js";
import { verifyToken } from "../../middlewares/auth.js";

const router = express.Router();

// Lấy tất cả yêu cầu tham gia sự kiện (có phân trang, lọc)
router.get("/", verifyToken, eventRequestController.getAllEventRequests);

// Lấy yêu cầu tham gia sự kiện theo ID
router.get("/:id", verifyToken, eventRequestController.getEventRequestById);

// Tạo yêu cầu tham gia sự kiện (yêu cầu đăng nhập)
router.post("/", verifyToken, eventRequestController.createEventRequest);

// Phản hồi yêu cầu tham gia sự kiện (yêu cầu đăng nhập)
router.put(
  "/:id/respond",
  verifyToken,
  eventRequestController.respondToRequest
);

// Hủy yêu cầu tham gia sự kiện (yêu cầu đăng nhập)
router.delete("/:id", verifyToken, eventRequestController.cancelRequest);

// Lấy danh sách yêu cầu tham gia một sự kiện (yêu cầu đăng nhập)
router.get(
  "/event/:eventId",
  verifyToken,
  eventRequestController.getRequestsByEventId
);

// Lấy danh sách yêu cầu tham gia sự kiện của một người dùng (yêu cầu đăng nhập)
router.get(
  "/user/:userId",
  verifyToken,
  eventRequestController.getRequestsByUserId
);

// Lấy số lượng yêu cầu đang chờ xử lý của một sự kiện (yêu cầu đăng nhập)
router.get(
  "/event/:eventId/pending-count",
  verifyToken,
  eventRequestController.getPendingRequestCount
);

export default router;
