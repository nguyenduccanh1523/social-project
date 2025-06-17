import { io } from "socket.io-client";

const socket = io("http://localhost:8989", {
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

socket.on("connect", () => {
    console.log("✅ Connected to socket.io:", socket.id);
});

socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error.message);
});

socket.on("disconnect", (reason) => {
    console.log("❌ Disconnected from socket.io. Reason:", reason);
});

socket.on("reconnect", (attemptNumber) => {
    console.log("🔄 Reconnected to socket.io after", attemptNumber, "attempts");
});

socket.on("reconnect_error", (error) => {
    console.error("❌ Socket reconnection error:", error.message);
});

// Thêm event listener cho các sự kiện khác
socket.on("receive_message", (message) => {
    console.log("📨 Received message:", message);
});

socket.on("user_typing", (data) => {
    console.log("⌨️ User typing:", data);
});

export default socket;
