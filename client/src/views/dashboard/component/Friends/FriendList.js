import React, { useEffect, useState } from 'react'
import { Row, Col, Container, Dropdown } from 'react-bootstrap'
import Card from '../../../../components/Card'
import { Link } from 'react-router-dom'
import { Input, Pagination } from 'antd';
//profile-header
import ProfileHeader from '../../../../components/profile-header'

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
import user05 from '../../../../assets/images/user/05.jpg'
import user06 from '../../../../assets/images/user/06.jpg'
import user07 from '../../../../assets/images/user/07.jpg'
import user08 from '../../../../assets/images/user/08.jpg'
import user09 from '../../../../assets/images/user/09.jpg'
import user10 from '../../../../assets/images/user/10.jpg'
import user13 from '../../../../assets/images/user/13.jpg'
import user14 from '../../../../assets/images/user/14.jpg'
import user15 from '../../../../assets/images/user/15.jpg'
import user16 from '../../../../assets/images/user/16.jpg'
import user17 from '../../../../assets/images/user/17.jpg'
import user18 from '../../../../assets/images/user/18.jpg'
import user19 from '../../../../assets/images/user/19.jpg'
import { useSelector } from 'react-redux'
import { apiGetFriendAccepted } from '../../../../services/friend'

const { Search } = Input;

const FriendList = () => {
    const { profile } = useSelector((state) => state.root.user || {});
    const documentId = profile?.documentId;
    const [friendList, setFriendList] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 88;
    useEffect(() => {
        const fetchFriendList = async () => {
            const response = await apiGetFriendAccepted({ documentId });
            setFriendList(response.data);
        };
        fetchFriendList();
    }, [documentId]);
    console.log("friendList", friendList);


    // Lọc tags theo searchText
    const filteredFriendList = friendList?.data?.filter(friend => {
        const searchLower = searchText.toLowerCase().trim();
        const isMatchingUserId = friend?.user_id?.documentId === documentId; // Kiểm tra documentId
        const isMatchingFriendId = friend?.friend_id?.documentId === documentId; // Kiểm tra friend_id.documentId

        // Nếu documentId khớp với user_id, tìm kiếm trong friend_id.username
        if (isMatchingUserId) {
            return !searchText || friend?.friend_id?.username?.toLowerCase().includes(searchLower);
        }

        // Nếu documentId khớp với friend_id, tìm kiếm trong user_id.username
        if (isMatchingFriendId) {
            return !searchText || friend?.user_id?.username?.toLowerCase().includes(searchLower);
        }

        // Nếu không khớp với cả hai, trả về false
        return false;
    });

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

    const images = [img1, img2, img3, img4, img5, img6, img7, img9, user05, user06, user07, user08, user09, user10, user13, user14, user15, user16, user17, user18, user19];
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
                    <Row>
                        {getCurrentPageFriendList()?.map((friend, index) => {
                            // Kiểm tra documentId và lấy friend_id hoặc user_id tương ứng
                            const friendData = friend?.user_id?.documentId === documentId ? friend?.friend_id : friend?.user_id;

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
                                                                    <img loading="lazy" src={friendData?.profile_picture} alt="profile-img" className="avatar-130 img-fluid" />
                                                                </div>
                                                                <div className="user-data-block">
                                                                    <h4>
                                                                        <Link to={`/friend-profile/${friendData?.documentId}`}
                                                                            state={{
                                                                                friendId: friendData
                                                                            }}
                                                                        >{friendData?.username || 'Unknown'}</Link>
                                                                    </h4>
                                                                    <h6>@{friendData?.username || 'unknown'}</h6>
                                                                    <p>{friendData?.bio}</p>
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
                </Container>
            </div>
        </>
    )

}

export default FriendList;