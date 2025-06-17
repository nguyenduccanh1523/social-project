import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//header
import Header from '../../components/partials/HeaderStyle/header'

//sidebar
import RightSidebar from '../../components/partials/SidebarStyle/rightsidebar'

//sidebar
import Sidebar from '../../components/partials/SidebarStyle/sidebar'

//footer
import Footer from '../../components/partials/FooterStyle/footer'

//default 
// import DefaultRouter from '../../router/default-router'

// share-offcanvas
// import ShareOffcanvas from '../../components/share-offcanvas'

//settingoffCanvas
import SettingOffCanvas from '../../components/setting/SettingOffCanvas'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import socket from '../../socket'
// import { notification } from "antd";
import { useState } from 'react'

const CustomNotificationToast = ({ notificationData }) => {
    // Sử dụng màu tím đồng nhất cho avatar như trong ảnh
    const avatarBackground = '#8e24aa'; 
    const iconColor = 'white'; 

    return (
        <div style={{ display: 'flex', alignItems: 'center', padding: '0' }}>
            <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: avatarBackground,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: iconColor,
                fontSize: '32px',
                fontWeight: 'bold',
                marginRight: '15px',
                flexShrink: 0
            }}>
                &#63; {/* HTML entity cho dấu hỏi */}
            </div>
            <div>
                <strong style={{ display: 'block', color: 'white', fontSize: '16px', marginBottom: '3px' }}>
                    🔔 {notificationData.title || "Thông báo mới"} {/* Thêm biểu tượng chuông */}
                </strong>
                <span style={{ color: '#cccccc', fontSize: '14px' }}>
                    {notificationData.content || "Bạn có thông báo mới!"}
                </span>
            </div>
        </div>
    );
};


const Default = () => {
    const { user } = useSelector(state => state.root.auth || {});
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        socket.onAny((event, ...args) => {
            // console.log(`📡 [SOCKET DEBUG] Event: ${event}`, args);
        });
    }, []);

    // Đăng ký socket vào phòng userId
    useEffect(() => {
        if (!user?.documentId) {
            return;
        }

        // console.log("🔄 [SOCKET] Attempting to register user:", user.documentId);

        // Delay 100-300ms để chắc chắn Redux đã ổn định
        const timer = setTimeout(() => {
            try {
                socket.emit("register", user.documentId);
                // console.log("✅ [SOCKET] Registered user:", user.documentId);
                setIsRegistered(true);
            } catch (error) {
                console.error("❌ [SOCKET] Registration failed:", error);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [user?.documentId]);

    // Nhận thông báo
    useEffect(() => {
        if (!isRegistered) return;

        const handler = (notificationData) => {
            // console.log("📨 [SOCKET] Nhận thông báo:", notificationData);
            toast.info(<CustomNotificationToast notificationData={notificationData} />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true, // Ẩn thanh tiến trình
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark", // Sử dụng theme tối cho giao diện toast tổng thể
                closeButton: false, // Ẩn nút đóng mặc định
                style: {
                    borderRadius: '8px',
                    padding: '12px 15px 12px 5px',
                    backgroundColor: '#2d3a4b', // Màu nền tối từ hình ảnh
                    overflow: 'hidden',
                },
            });
        };

        socket.on("receive_notification", handler);

        return () => {
            socket.off("receive_notification", handler);
        };
    }, [isRegistered]);
    return (
        <>
            <Sidebar />
            <Header />
            <div className="main-content">
                {/* <div id="content-page" className="content-page"> */}
                {/* <DefaultRouter/> */}
                <Outlet />
                {/* </div> */}
            </div>
            <RightSidebar />
            <Footer />
            <SettingOffCanvas />
            <ToastContainer /> {/* ToastContainer đơn giản, hầu hết các tùy chọn được truyền cho các lệnh gọi toast riêng lẻ */}
        </>
    )
}

export default Default
