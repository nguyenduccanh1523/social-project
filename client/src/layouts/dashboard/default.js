import React from 'react'
import { notification } from 'antd';
import { BellFilled } from '@ant-design/icons';

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
            notification.info({
                message: (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <BellFilled style={{ color: '#FFD700', fontSize: '32px', marginRight: '15px' }} />
                        <div>
                            <strong style={{ display: 'block', color: 'white', fontSize: '16px', marginBottom: '3px' }}>
                                {notificationData.title || "Thông báo mới"}
                            </strong>
                            <span style={{ color: '#cccccc', fontSize: '14px' }}>
                                {notificationData.content || "Bạn có thông báo mới!"}
                            </span>
                        </div>
                    </div>
                ),
                placement: 'topRight',
                duration: 5,
                style: {
                    borderRadius: '8px',
                    padding: '15px 20px',
                    backgroundColor: '#2d3a4b',
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
        </>
    )
}

export default Default
