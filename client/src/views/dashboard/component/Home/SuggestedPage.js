import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../../../components/Card";
import { apiGetPage } from "../../../../services/page";
import user05 from "../../../../assets/images/user/05.jpg";

const SuggestedPage = () => {
    const [randomPages, setRandomPages] = useState([]);

    // Hàm lấy ngẫu nhiên 3 phần tử từ mảng
    const getRandomItems = (array) => {
        return [...array].sort(() => 0.5 - Math.random()).slice(0, 3);
    };

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const response = await apiGetPage();
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
                        <h4 className="card-title">Suggested Pages</h4>
                    </div>
                </div>
                <Card.Body>
                    <ul className="suggested-page-story m-0 p-0 list-inline">
                        {randomPages.map((page, index) => (
                            <li key={page.id} className={index !== randomPages.length - 1 ? 'mb-3' : ''}>
                                <div className="d-flex align-items-center mb-3">
                                    <img
                                        src={page.profile_picture?.file_path || user05}
                                        alt="page-img"
                                        className="rounded-circle img-fluid avatar-50"
                                    />
                                    <div className="stories-data ms-3">
                                        <h5 className="d-flex align-items-center">
                                            {page?.page_name}
                                            {page?.is_verified && (
                                                <i
                                                    className="material-symbols-outlined verified-badge ms-2"
                                                    style={{
                                                        fontSize: "20px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    verified
                                                </i>
                                            )}
                                        </h5>
                                        <p className="mb-0">{page.intro || 'No description'}</p>
                                    </div>
                                </div>
                                <img
                                    src={page.profile_picture?.file_path || user05}
                                    className="img-fluid rounded w-100"
                                    alt="page-img"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div className="mt-3">
                                    <Link
                                        to={`/page/${page.page_name}`}
                                        state={{
                                            pageId: page.documentId,
                                            pageDetail: page
                                        }}
                                        className="btn btn-primary w-100"
                                    >
                                        <i className="ri-arrow-right-line me-2"></i> View Page
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

export default SuggestedPage;

