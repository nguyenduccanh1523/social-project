import React from "react";
import { Link } from "react-router-dom";
import Card from "../../../../components/Card";

import "react-toastify/dist/ReactToastify.css";

//image

import img42 from "../../../../assets/images/page-img/42.png";
import img9 from "../../../../assets/images/small/img-1.jpg";
import img10 from "../../../../assets/images/small/img-2.jpg";
import s4 from "../../../../assets/images/page-img/s4.jpg";
import s5 from "../../../../assets/images/page-img/s5.jpg";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { apiGetEvent } from "../../../../services/eventServices/event";

const SuggestedEvent = () => {

    const { token } = useSelector((state) => state.root.auth || {})
    const [randomPages, setRandomPages] = useState([]);

    // Hàm lấy ngẫu nhiên 3 phần tử từ mảng
    const getRandomItems = (array) => {
        return [...array].sort(() => 0.5 - Math.random()).slice(0, 3);
    };

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const response = await apiGetEvent({token: token});
                const allPages = response.data?.data || [];
                // Lấy ngay 3 trang ngẫu nhiên khi fetch xong
                setRandomPages(getRandomItems(allPages));
            } catch (error) {
                console.error("Error fetching pages:", error);
            }
        };
        fetchPages();
    }, []); // Chỉ
    //  chạy 1 lần khi component mount
    //console.log("randomPages", randomPages);
    return (
        <>
            <Card>
                <div className="card-header d-flex justify-content-between">
                    <div className="header-title">
                        <h4 className="card-title">Events</h4>
                    </div>
                </div>
                <Card.Body>
                    <ul className="suggested-page-story m-0 p-0 list-inline">
                        
                    {randomPages.map((page, index) => (
                            <li key={page.documentId} className={index !== randomPages.length - 1 ? 'mb-3' : ''}>
                                <div className="d-flex align-items-center mb-3">
                                    <img
                                        src={page.image?.file_path}
                                        alt="page-img"
                                        className="rounded-circle img-fluid avatar-50"
                                    />
                                    <div className="stories-data ms-3">
                                        <h5 className="d-flex align-items-center">
                                            {page?.name}
                                        </h5>
                                        <p className="mb-0">{page.description || 'No description'}</p>
                                    </div>
                                </div>
                                <img
                                    src={page.image?.file_path}
                                    className="img-fluid rounded w-100"
                                    alt="page-img"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div className="mt-3">
                                    <Link
                                        to={`/event-detail/${page?.documentId}`} state={{ eventDetail: page }}
                                        className="btn btn-primary w-100"
                                    >
                                        <i className="ri-arrow-right-line me-2"></i> View Event
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card.Body>
            </Card>
        </>
    );
};

export default SuggestedEvent;

