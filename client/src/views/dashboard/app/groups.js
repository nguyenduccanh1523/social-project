import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import Card from "../../../components/Card";
import { Link } from "react-router-dom";
import ProfileHeader from "../../../components/profile-header";

// images
import gi1 from "../../../assets/images/page-img/gi-1.jpg";
import user05 from "../../../assets/images/user/05.jpg";
import user06 from "../../../assets/images/user/06.jpg";
import user07 from "../../../assets/images/user/07.jpg";
import user08 from "../../../assets/images/user/08.jpg";
import user09 from "../../../assets/images/user/09.jpg";
import user10 from "../../../assets/images/user/10.jpg";
import img1 from "../../../assets/images/page-img/profile-bg1.jpg";
import img2 from "../../../assets/images/page-img/profile-bg2.jpg";
import img3 from "../../../assets/images/page-img/profile-bg3.jpg";
import img4 from "../../../assets/images/page-img/profile-bg4.jpg";
import img5 from "../../../assets/images/page-img/profile-bg5.jpg";
import img6 from "../../../assets/images/page-img/profile-bg6.jpg";
import img7 from "../../../assets/images/page-img/profile-bg7.jpg";
import img9 from "../../../assets/images/page-img/profile-bg9.jpg";
import { useDispatch, useSelector } from "react-redux";

import { fetchGroup, fetchGroupMembers } from "../../../actions/actions";

const Groups = () => {
  const dispatch = useDispatch();
  const { groups } = useSelector((state) => state.root.group || {});
  const { members } = useSelector((state) => state.root.group || {});
  const images = [img1, img2, img3, img4, img5, img6, img7, img9];
  console.log("mem: ", members);

  useEffect(() => {
    dispatch(fetchGroup());
  }, [dispatch]);

  useEffect(() => {
    groups?.data?.forEach((group) => {
      //console.log("group.documentId:", group.documentId); // Kiểm tra groupId
      dispatch(fetchGroupMembers(group.documentId)); // Truyền đúng giá trị groupId
    });
  }, [groups, dispatch]);

  return (
    <>
      <ProfileHeader img={img7} title="Groups" />
      <div id="content-page" className="content-page">
        <Container>
          <div className="d-grid gap-3 d-grid-template-1fr-19">
            {groups?.data?.length > 0 ? (
              groups.data.map((group, index) => {
                // Lấy thành viên của nhóm hiện tại từ Redux
                const groupMembers = members[group.documentId] || [];

                // Đảm bảo groupMembers là mảng trước khi gọi .slice()
                const validGroupMembers = Array.isArray(groupMembers)
                  ? groupMembers
                  : [];

                return (
                  <Card className="mb-0" key={group.id}>
                    <div className="top-bg-image">
                      <img
                        src={images[index % images.length]}
                        className="img-fluid w-100"
                        alt="group-bg"
                      />
                    </div>
                    <Card.Body className="text-center">
                      <div className="group-icon">
                        <img
                          src={group.image_group}
                          alt="profile-img"
                          className="rounded-circle img-fluid avatar-120"
                        />
                      </div>
                      <div className="group-info pt-3 pb-3">
                        <h4>
                          <Link to={`/dashboards/app/group-detail/${group.id}`}>
                            {group.group_name}
                          </Link>
                        </h4>
                        <p>{group.description}</p>
                      </div>
                      <div className="group-details d-inline-block pb-3">
                        <ul className="d-flex align-items-center justify-content-between list-inline m-0 p-0">
                          <li className="pe-3 ps-3">
                            <p className="mb-0">Post</p>
                            <h6>{group.posts?.length || 0}</h6>
                          </li>
                          <li className="pe-3 ps-3">
                            <p className="mb-0">Member</p>
                            <h6>{validGroupMembers.length || 0}</h6>{" "}
                            {/* Hiển thị số lượng thành viên */}
                          </li>
                          <li className="pe-3 ps-3">
                            <p className="mb-0">Request</p>
                            <h6>{group.requests?.length || 0}</h6>
                          </li>
                        </ul>
                      </div>
                      <div className="group-member mb-3">
                        <div className="iq-media-group">
                          {validGroupMembers
                            .slice(0, 6)
                            .map((member, index) => (
                              <Link to="#" className="iq-media" key={index}>
                                <img
                                  className="img-fluid avatar-40 rounded-circle"
                                  src={member.profile_picture || user05}
                                  alt="profile-img"
                                />
                              </Link>
                            ))}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                );
              })
            ) : (
              <p className="text-center">No groups available</p>
            )}
          </div>
        </Container>
      </div>
    </>
  );
};

export default Groups;
