import React, { useEffect, useState } from 'react'
import { Row, Col, Container, Dropdown, Modal, Button } from 'react-bootstrap'
import Card from '../../../../components/Card'
import CustomToggle from '../../../../components/dropdowns'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ReactFsLightbox from 'fslightbox-react';
import ShareOffcanvas from '../../../../components/share-offcanvas'
import AddFriend from './addFriend'

// images
import img1 from '../../../../assets/images/page-img/profile-bg1.jpg'
import img5 from '../../../../assets/images/icon/10.png'
import user1 from '../../../../assets/images/user/1.jpg'
import user05 from '../../../../assets/images/user/05.jpg'
import user02 from '../../../../assets/images/user/02.jpg'
import user03 from '../../../../assets/images/user/03.jpg'
import user08 from '../../../../assets/images/user/08.jpg'
import user09 from '../../../../assets/images/user/09.jpg'
import icon1 from '../../../../assets/images/icon/01.png'
import icon2 from '../../../../assets/images/icon/02.png'
import icon3 from '../../../../assets/images/icon/03.png'
import icon4 from '../../../../assets/images/icon/04.png'
import icon5 from '../../../../assets/images/icon/05.png'
import icon6 from '../../../../assets/images/icon/06.png'
import icon7 from '../../../../assets/images/icon/07.png'
import icon8 from '../../../../assets/images/icon/08.png'
import icon9 from '../../../../assets/images/icon/09.png'
import icon10 from '../../../../assets/images/icon/10.png'
import icon11 from '../../../../assets/images/icon/11.png'
import icon12 from '../../../../assets/images/icon/12.png'
import icon13 from '../../../../assets/images/icon/13.png'
import g1 from '../../../../assets/images/page-img/g1.jpg'
import g2 from '../../../../assets/images/page-img/g2.jpg'
import g3 from '../../../../assets/images/page-img/g3.jpg'
import g4 from '../../../../assets/images/page-img/g4.jpg'
import g5 from '../../../../assets/images/page-img/g5.jpg'
import g6 from '../../../../assets/images/page-img/g6.jpg'
import g7 from '../../../../assets/images/page-img/g7.jpg'
import g8 from '../../../../assets/images/page-img/g8.jpg'
import g9 from '../../../../assets/images/page-img/g9.jpg'
import img56 from '../../../../assets/images/page-img/p2.jpg'
import img58 from '../../../../assets/images/page-img/p1.jpg'
import img57 from '../../../../assets/images/page-img/p3.jpg'
import small07 from '../../../../assets/images/small/07.png'
import small08 from '../../../../assets/images/small/08.png'
import small09 from '../../../../assets/images/small/09.png'
import small1 from '../../../../assets/images/small/07.png'
import small2 from '../../../../assets/images/small/08.png'
import small3 from '../../../../assets/images/small/09.png'
import small4 from '../../../../assets/images/small/10.png'
import small5 from '../../../../assets/images/small/11.png'
import small6 from '../../../../assets/images/small/12.png'
import small7 from '../../../../assets/images/small/13.png'
import small8 from '../../../../assets/images/small/14.png'
import user9 from '../../../../assets/images/user/1.jpg'
import img59 from '../../../../assets/images/page-img/59.jpg'
import { useQuery } from '@tanstack/react-query'
import { apiGetFriendData } from '../../../../services/user'
import { apiCreateFriendStatus, apiGetFriendAccepted, apiGetCheckFriendRequest, apiUpdateFriendStatus } from '../../../../services/friend'
import { apiCheckConversation, apiCreateConver } from '../../../../services/conversation'
import { apiCreateMessager } from '../../../../services/message'
import { useSelector } from 'react-redux'
import PostProfile from '../Profile/postProfile'
// Fslightbox plugin
const FsLightbox = ReactFsLightbox.default ? ReactFsLightbox.default : ReactFsLightbox;

const FriendProfile = () => {
   const location = useLocation();
   const {
      friendId
   } = location.state || {};

   const { token, user } = useSelector((state) => state.root.auth || {});

   const [show, setShow] = useState(false);
   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);
   const [userFriendCounts, setUserFriendCounts] = useState([]);
   const [isFriend, setIsFriend] = useState(false);
   const [isSent, setSent] = useState(false);
   const [isRequest, setRequest] = useState(false);
   const [showAcceptModal, setShowAcceptModal] = useState(false);

   const navigate = useNavigate();

   const { data: friendData, isLoading, error } = useQuery({
      queryKey: ['friendData', friendId, token],
      queryFn: () => apiGetFriendData({ userId: friendId, token }),
   });
   const friendUserData = friendData?.data?.data || [];

   const { data: friendRequest } = useQuery({
      queryKey: ['friendRequest', friendId, user?.documentId, token],
      queryFn: () => apiGetCheckFriendRequest({ userId: user?.documentId, documentId: friendId, token }),
   });
   const friendRequestUser = friendRequest?.data?.data || [];

   
   // Kiểm tra xem đã là bạn bè chưa
   useEffect(() => {
      if (friendUserData?.friends) {
         const checkIsFriend = friendUserData.friends.some(
            friend => friend.documentId === user?.documentId
         );
         setIsFriend(checkIsFriend);
      }
      if (friendRequestUser?.length) {
         const request = friendRequestUser[0];
         if (request.user.documentId === user?.documentId) {
            setSent(true);
         } else {
            setRequest(true);
         }
      }
   }, [friendUserData, friendRequestUser, user]);

   const handleAddFriend = async () => {
      try {
         const payload = {
            user_id: user?.documentId,
            friend_id: friendUserData?.documentId,
            status_action_id: 'w1t6ex59sh5auezhau5e2ovu'
         }
         await apiCreateFriendStatus(payload, token);
         setSent(true);
      } catch (error) {
         console.error('Error adding friend:', error);
      }
   };

   const handleAcceptFriend = async ({documentId}) => {
      try {
         await apiUpdateFriendStatus({friendId: friendRequestUser?.[0]?.documentId, status_action_id: 'vr8ygnd5y17xs4vcq6du3q7c', token: token});
         setIsFriend(true);
         setRequest(false);
         setShowAcceptModal(false);
      } catch (error) {
         console.error('Error accepting friend:', error);
      }
   };

   const handleRejectFriend = () => {
      setRequest(false);
      setShowAcceptModal(false);
   };

   const handleMessage = async () => {
      try {
         const checkConversation = await apiCheckConversation({
            userId: user?.documentId,
            partiId: friendId,
            token
         });

         let conversationId;
         if (checkConversation.data.data.length > 0) {
            conversationId = checkConversation.data.data[0].documentId;
         } else {
            const newConversationPayload = {
               is_group_chat: false,
               conversation_created_by: user?.documentId,
               user_chated_with: friendUserData?.documentId,
            };
            const newConversation = await apiCreateConver(newConversationPayload, token);
            conversationId = newConversation.data.data?.documentId;

            // Tạo tin nhắn trống ban đầu
            const initialMessagePayload = {
               sender_id: user?.documentId,
               conversation_id: conversationId,
               content: 'Hello!', // Hoặc bất kỳ tin nhắn mặc định nào
            };
            await apiCreateMessager(initialMessagePayload, token);
         }
         navigate(`/chat#${conversationId}`);
      } catch (error) {
         console.error('Error handling message:', error);
      }
   };

   // const { data: friendCountData, isLoading: friendCountLoading, error: friendCountError } = useQuery({
   //    queryKey: ['friendCount', friendUserData?.documentId, token],
   //    queryFn: () => apiGetFriendAccepted({ documentId: friendUserData?.documentId, token }),
   // });
   // const friendCount = friendCountData?.data?.data || 0;
   // console.log('d', friendCount)
   // const friend = friendCount?.map(item => item?.user?.documentId !== friendId);
   // setUserFriendCounts(friend);
   // console.log('userFriendCounts', friend);


   const [imageController, setImageController] = useState({
      toggler: false,
      slide: 1
   });

   function imageOnSlide(number) {
      setImageController({
         toggler: !imageController.toggler,
         slide: number
      });
   }

   // Kiểm tra trạng thái loading và error
   if (isLoading) return <div>Loading...</div>;
   if (error) return <div>Error fetching friend data</div>;

   return (
      <>
         <FsLightbox
            toggler={imageController.toggler}
            sources={[g1, g2, g3, g4, g5, g6, g7, g8, g9]}
            slide={imageController.slide}
         />
         <Container>
            <Row>
               <Col sm={12}>
                  <Card>
                     <Card.Body className=" profile-page p-0">
                        <div className="profile-header profile-info">
                           <div className="cover-container">
                              <img loading="lazy" src={img1} alt="profile-bg" className="rounded img-fluid" />
                              <ul className="header-nav d-flex flex-wrap justify-end p-0 m-0">
                                 <li>
                                    <Link to="#" className="material-symbols-outlined">
                                       edit
                                    </Link>
                                 </li>
                                 <li>
                                    <Link to="#" className="material-symbols-outlined">
                                       settings
                                    </Link>
                                 </li>
                              </ul>
                           </div>
                           <div className="user-detail text-center mb-3">
                              <div className="profile-img">
                                 <img loading="lazy" src={friendUserData?.avatarMedia?.file_path} alt="profile-img" className="avatar-130 img-fluid" />
                              </div>
                              <div className="profile-detail">
                                 <h3>{friendUserData?.fullname}</h3>
                              </div>
                           </div>
                           <div className="profile-info p-4 d-flex align-items-center justify-content-between position-relative">
                              <div className="social-links">
                                 <ul className="social-data-block d-flex align-items-center justify-content-between list-inline p-0 m-0">
                                    <li className="text-center pe-3">
                                       <Link to="#"><img loading="lazy" src={icon8} className="img-fluid rounded" alt="facebook" /></Link>
                                    </li>
                                    <li className="text-center pe-3">
                                       <Link to="#"><img loading="lazy" src={icon9} className="img-fluid rounded" alt="Twitter" /></Link>
                                    </li>
                                    <li className="text-center pe-3">
                                       <Link to="#"><img loading="lazy" src={icon10} className="img-fluid rounded" alt="Instagram" /></Link>
                                    </li>
                                    <li className="text-center pe-3">
                                       <Link to="#"><img loading="lazy" src={icon11} className="img-fluid rounded" alt="Google plus" /></Link>
                                    </li>
                                    <li className="text-center pe-3">
                                       <Link to="#"><img loading="lazy" src={icon12} className="img-fluid rounded" alt="You tube" /></Link>
                                    </li>
                                    <li className="text-center pe-3">
                                       <Link to="#"><img loading="lazy" src={icon13} className="img-fluid rounded" alt="linkedin" /></Link>
                                    </li>
                                 </ul>
                              </div>
                              <div className="d-flex align-items-center">
                                 <div className="profile-actions me-3">
                                    {!isFriend && !isSent && !isRequest && (
                                       <AddFriend 
                                          friend={friendUserData}
                                          onSentChange={setSent}
                                       />
                                    )}
                                    {isSent && (
                                       <Button
                                          variant="success"
                                          className="me-2"
                                          disabled
                                       >
                                          <i className="material-symbols-outlined me-1">check_circle</i>
                                          Sent
                                       </Button>
                                    )}
                                    {isRequest && (
                                       <Button
                                          variant="primary"
                                          className="me-2"
                                          onClick={() => setShowAcceptModal(true)}
                                       >
                                          <i className="material-symbols-outlined me-1">person_add</i>
                                          Friend Request
                                       </Button>
                                    )}
                                    {isFriend && (
                                       <Button
                                          variant="success"
                                          className="me-2"
                                          disabled
                                       >
                                          <i className="material-symbols-outlined me-1">check_circle</i>
                                          Friends
                                       </Button>
                                    )}
                                    <Button
                                       variant="info"
                                       className="text-white"
                                       onClick={handleMessage}
                                    >
                                       <i className="material-symbols-outlined me-1">chat</i>
                                       Message
                                    </Button>
                                 </div>
                                 <div className="social-info">
                                    <ul className="social-data-block d-flex align-items-center justify-content-between list-inline p-0 m-0">
                                       <li className="text-center pe-3">
                                          <h6>Posts</h6>
                                          <p className="mb-0">690</p>
                                       </li>
                                       <li className="text-center pe-3">
                                          <h6>Friends</h6>
                                          <p className="mb-0">{friendUserData?.friendCount || 0}</p>
                                       </li>
                                    </ul>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </Card.Body>
                  </Card>
               </Col>
               <Row>
                  <Col lg={4}>
                     <Card>
                        <div className="card-header d-flex justify-content-between">
                           <div className="header-title">
                              <h4 className="card-title">About</h4>
                           </div>
                        </div>
                        <Card.Body>
                           <ul className="list-inline p-0 m-0">
                              <li className="mb-2 d-flex align-items-center">
                                 <span className="material-symbols-outlined md-18">
                                    person
                                 </span>
                                 <p className="mb-0 ms-2">{friendUserData?.about}</p>
                              </li>
                              <li className="mb-2 d-flex align-items-center">
                                 <span className="material-symbols-outlined md-18">
                                    email
                                 </span>
                                 <p className="mb-0 ms-2">{friendUserData?.email}</p>
                              </li>
                              <li className="mb-2 d-flex align-items-center">
                                 <span className="material-symbols-outlined md-18">
                                    language
                                 </span>
                                 <p className="mb-0 ms-2">{friendUserData?.language}</p>
                              </li>
                              <li className="mb-2 d-flex align-items-center">
                                 <span className="material-symbols-outlined md-18">
                                    place
                                 </span>
                                 <p className="mb-0 ms-2">{friendUserData?.nation?.name}</p>
                              </li>
                              <li className="d-flex align-items-center">
                                 <span className="material-symbols-outlined md-18">
                                    favorite
                                 </span>
                                 <p className="mb-0 ms-2">{friendUserData?.relationship_status}</p>
                              </li>
                           </ul>
                        </Card.Body>
                     </Card>
                     <Card>
                        <div className="card-header d-flex justify-content-between">
                           <div className="header-title">
                              <h4 className="card-title">Photos</h4>
                           </div>
                           <div className="card-header-toolbar d-flex align-items-center">
                           </div>
                        </div>
                        <Card.Body>
                           <ul className="profile-img-gallary p-0 m-0 list-unstyled">
                              <li><Link to="#"><img loading="lazy" onClick={() => imageOnSlide(1)} src={g1} alt="gallary" className="img-fluid" /></Link></li>
                              <li><Link to="#"><img loading="lazy" onClick={() => imageOnSlide(2)} src={g2} alt="gallary" className="img-fluid" /></Link></li>
                              <li><Link to="#"><img loading="lazy" onClick={() => imageOnSlide(3)} src={g3} alt="gallary" className="img-fluid" /></Link></li>
                              <li><Link to="#"><img loading="lazy" onClick={() => imageOnSlide(4)} src={g4} alt="gallary" className="img-fluid" /></Link></li>
                              <li><Link to="#"><img loading="lazy" onClick={() => imageOnSlide(5)} src={g5} alt="gallary" className="img-fluid" /></Link></li>
                              <li><Link to="#"><img loading="lazy" onClick={() => imageOnSlide(6)} src={g6} alt="gallary" className="img-fluid" /></Link></li>
                              <li><Link to="#"><img loading="lazy" onClick={() => imageOnSlide(7)} src={g7} alt="gallary" className="img-fluid" /></Link></li>
                              <li><Link to="#"><img loading="lazy" onClick={() => imageOnSlide(8)} src={g8} alt="gallary" className="img-fluid" /></Link></li>
                              <li><Link to="#"><img loading="lazy" onClick={() => imageOnSlide(9)} src={g9} alt="gallary" className="img-fluid" /></Link></li>
                           </ul>
                        </Card.Body>
                     </Card>
                     <Card>
                        <div className="card-header d-flex justify-content-between">
                           <div className="header-title">
                              <h4 className="card-title">Friends</h4>
                           </div>
                           <div className="card-header-toolbar d-flex align-items-center">
                           </div>
                        </div>
                        <Card.Body>
                           <ul className="profile-img-gallary p-0 m-0 list-unstyled">
                              {userFriendCounts?.data?.length === 0 ? (
                                 <div className="text-center">No friends available.</div>
                              ) : (
                                 userFriendCounts?.data?.map((item, index) => {
                                    const friendData = item?.user_id?.documentId === friendUserData?.documentId
                                       ? item?.friend_id
                                       : item?.user_id;
                                    return (
                                       <li key={index}>
                                          <Link to="#">
                                             <img loading="lazy" src={friendData?.avatarMedia?.file_path} alt="gallary" className="img-fluid w-100 h-75" />
                                          </Link>
                                          <h6 className="mt-2 text-center">{friendData?.username}</h6>
                                       </li>
                                    );
                                 })
                              )}
                           </ul>
                        </Card.Body>
                     </Card>
                  </Col>
                  <Col lg={8}>
                     <Card>
                        <Card.Body>
                           <PostProfile userId={friendUserData} />

                        </Card.Body>
                     </Card>
                  </Col>
               </Row>
            </Row>
         </Container>
         <Modal show={showAcceptModal} onHide={() => setShowAcceptModal(false)}>
            <Modal.Header style={{marginTop: '70px'}} closeButton>
               <Modal.Title>Friend Request</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               Do you want to accept friend request from {friendUserData?.fullname}?
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleRejectFriend}>
                  Reject
               </Button>
               <Button variant="primary" onClick={handleAcceptFriend}>
                  Accept
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   )
}
export default FriendProfile;