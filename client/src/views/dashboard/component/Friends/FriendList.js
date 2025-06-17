import React, { useEffect, useState } from 'react'
import { Row, Col, Container, Dropdown } from 'react-bootstrap'
import Card from '../../../../components/Card'
import { Link } from 'react-router-dom'
import { Input, Pagination } from 'antd';
//profile-header
import ProfileHeader from '../../../../components/profile-header'
import Loader from "../../icons/uiverse/Loading";

// image
import img1 from '../../../../assets/images/page-img/profile-bg2.jpg'
import img2 from '../../../../assets/images/page-img/profile-bg1.jpg'
import img3 from '../../../../assets/images/page-img/profile-bg3.jpg'
import img4 from '../../../../assets/images/page-img/profile-bg4.jpg'
import img5 from '../../../../assets/images/page-img/profile-bg5.jpg'
import img6 from '../../../../assets/images/page-img/profile-bg6.jpg'
import img7 from '../../../../assets/images/page-img/profile-bg7.jpg'
import img8 from '../../../../assets/images/page-img/profile-bg8.jpg'
import img9 from '../../../../assets/images/page-img/profile-bg9.jpg'

import { useSelector } from 'react-redux'
import { apiGetFriendAccepted } from '../../../../services/friend'
import { useQuery, useQueryClient } from "@tanstack/react-query";

const { Search } = Input;

const FriendList = () => {
    const { token, user } = useSelector((state) => state.root.auth || {});

    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 88;
    const { data: userAcceptData, isLoading: userAcceptLoading } = useQuery({
        queryKey: ['userAccept', user?.documentId, token],
        queryFn: () => apiGetFriendAccepted({ documentId: user?.documentId, token }),
        enabled: !!user?.documentId && !!token,
        onSuccess: (data) => {
            console.log("User data fetched successfully:", data);
        },
        onError: (error) => {
            console.error("Error fetching user data:", error);
        }
    });

    const friendList = userAcceptData?.data?.data || [];

    // console.log("friendList", friendList);

    // Lọc tags theo searchText
    const filteredFriendList = friendList?.filter(friend => {
        const searchLower = searchText.toLowerCase().trim();
        const isMatchingUserId = friend?.user?.documentId === user?.documentId; // Kiểm tra documentId
        const isMatchingFriendId = friend?.friend?.documentId === user?.documentId; // Kiểm tra friend_id.documentId

        // Nếu documentId khớp với user_id, tìm kiếm trong friend_id.username
        if (isMatchingUserId) {
            return !searchText || friend?.friend?.fullname?.toLowerCase().includes(searchLower);
        }

        // Nếu documentId khớp với friend_id, tìm kiếm trong user_id.username
        if (isMatchingFriendId) {
            return !searchText || friend?.user?.fullname?.toLowerCase().includes(searchLower);
        }

        // Nếu không khớp với cả hai, trả về false
        return false;
    });
    // console.log("filteredFriendList", filteredFriendList);

    // Tính toán tags cho trang hiện tại từ danh sách đã lọc
    const getCurrentPageFriendList = () => {
        if (!filteredFriendList) return [];
        const startIndex = (currentPage - 1) * pageSize;
        return filteredFriendList.slice(startIndex, startIndex + pageSize);
    };
    

    // Xử lý khi search thay đổi
    const handleSearch = (value) => {
        setSearchText(value);
        setCurrentPage(1); // Reset về trang 1 khi search
    };

    const images = [img1, img2, img3, img4, img5, img6, img7, img9];
    return (
        <>
            <ProfileHeader title="Friend Lists" img={img3} />
            <div id="content-page" className="content-page">
                <Container>

                    <Row className="mb-3">
                        <Col lg="12">
                            <Card>
                                <Card.Body>
                                    <Search
                                        placeholder="Search friend..."
                                        allowClear
                                        enterButton="Search"
                                        size="large"
                                        value={searchText}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        onSearch={handleSearch}
                                        style={{ width: 400 }}
                                    />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    {userAcceptLoading ? (
                        <div className="col-sm-12 text-center">
                            <Loader />
                        </div>
                    ) : (
                        <>
                            <Row>
                                {getCurrentPageFriendList()?.map((friend, index) => {
                                    // Kiểm tra documentId và lấy friend_id hoặc user_id tương ứng
                                    const friendData = friend?.user?.documentId === user?.documentId ? friend?.friend : friend?.user;
                                    // console.log("friendData", friendData);
                                    return (
                                        <Col md={6} key={friendData?.documentId}>
                                            <Card className="card-block card-stretch card-height">
                                                <Card.Body className="profile-page p-0">
                                                    <div className="profile-header-image">
                                                        <div className="cover-container">
                                                            <img loading="lazy" src={images[index % images.length]} alt="profile-bg" className="rounded img-fluid w-100" />
                                                        </div>
                                                        <div className="profile-info p-4">
                                                            <div className="user-detail">
                                                                <div className="d-flex flex-wrap justify-content-between align-items-start">
                                                                    <div className="profile-detail d-flex">
                                                                        <div className="profile-img pe-4">
                                                                            <img loading="lazy" src={friendData?.avatarMedia?.file_path} alt="profile-img" className="avatar-100 rounded-circle" />
                                                                        </div>
                                                                        <div className="user-data-block">
                                                                            <h4>
                                                                                <Link to={`/friend-profile/${friendData?.documentId}`}
                                                                                    state={{
                                                                                        friendId: friendData?.documentId
                                                                                    }}
                                                                                >{friendData?.fullname || 'Unknown'}</Link>
                                                                            </h4>
                                                                            <h6>@{friendData?.fullname || 'unknown'}</h6>
                                                                        </div>
                                                                    </div>

                                                                    <div className="card-header-toolbar d-flex align-items-center">
                                                                        <Dropdown>
                                                                            <Dropdown.Toggle variant="secondary me-2 d-flex align-items-center">
                                                                                <i className="material-symbols-outlined me-2">
                                                                                    done
                                                                                </i>
                                                                                Friend
                                                                            </Dropdown.Toggle>
                                                                            <Dropdown.Menu className="dropdown-menu-right">
                                                                                <Dropdown.Item href="#">
                                                                                    Get Notification
                                                                                </Dropdown.Item>
                                                                                <Dropdown.Item href="#">
                                                                                    Close Friend
                                                                                </Dropdown.Item>
                                                                                <Dropdown.Item href="#">
                                                                                    Unfollow
                                                                                </Dropdown.Item>
                                                                                <Dropdown.Item href="#">
                                                                                    Unfriend
                                                                                </Dropdown.Item>
                                                                                <Dropdown.Item href="#">
                                                                                    Block
                                                                                </Dropdown.Item>
                                                                            </Dropdown.Menu>
                                                                        </Dropdown>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    );
                                })}
                            </Row>
                            <Row className="mt-3 mb-3">
                                <Col lg="12" className="d-flex justify-content-end">
                                    <Pagination
                                        current={currentPage}
                                        total={filteredFriendList?.length || 0}
                                        pageSize={pageSize}
                                        onChange={setCurrentPage}
                                        showSizeChanger={false}
                                    />
                                </Col>
                            </Row>
                        </>
                    )}
                </Container>
            </div>
        </>
    )

}

export default FriendList;