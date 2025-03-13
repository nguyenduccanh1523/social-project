import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Card from "../../../../components/Card";
import { Link } from "react-router-dom";
import ProfileHeader from "../../../../components/profile-header";

// images
import user05 from "../../../../assets/images/user/05.jpg";
import img1 from "../../../../assets/images/page-img/profile-bg1.jpg";
import img2 from "../../../../assets/images/page-img/profile-bg2.jpg";
import img3 from "../../../../assets/images/page-img/profile-bg3.jpg";
import img4 from "../../../../assets/images/page-img/profile-bg4.jpg";
import img5 from "../../../../assets/images/page-img/profile-bg5.jpg";
import img6 from "../../../../assets/images/page-img/profile-bg6.jpg";
import img7 from "../../../../assets/images/page-img/profile-bg7.jpg";
import img9 from "../../../../assets/images/page-img/profile-bg9.jpg";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchFindOneGroup,
  fetchGroupMembers,
  fetchMyGroup,
} from "../../../../actions/actions";
import { apiGetGroupRequest } from "../../../../services/groupServices/groupRequest";

const MyGroups = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.root.user || {});
  const { findgroup } = useSelector((state) => state.root.group || {});
  const { mygroups } = useSelector((state) => state.root.group || {});
  const { members } = useSelector((state) => state.root.group || {});
  const images = [img1, img2, img3, img4, img5, img6, img7, img9];

  const document = profile?.documentId;
  const [groupRequests, setGroupRequests] = useState({});

  useEffect(() => {
    if (document) {
      dispatch(fetchMyGroup(document));
    }
  }, [document, dispatch]);

  useEffect(() => {
    mygroups[document]?.data?.forEach((group) => {
      dispatch(fetchFindOneGroup(group?.group_id?.documentId)); // Truyền đúng giá trị groupId
    });
  }, [document, mygroups, dispatch]);

  useEffect(() => {
    mygroups[document]?.data?.forEach((group) => {
      dispatch(fetchGroupMembers(group?.group_id?.documentId)); // Truyền đúng giá trị groupId
    });
  }, [mygroups, document, dispatch]);

  useEffect(() => {
    const fetchGroupRequests = async () => {
      const requests = {};
      for (const group of mygroups[document]?.data || []) {
        const groupId = group?.group_id?.documentId;
        //console.log("groupId", groupId);
        const response = await apiGetGroupRequest({ groupId: groupId });
        //console.log("response", response);
        requests[groupId] = response.data?.data.length;
      }
      setGroupRequests(requests);
    };

    if (mygroups[document]?.data?.length > 0) {
      fetchGroupRequests();
    }
  }, [mygroups, document]);

  return (
    <>
      <ProfileHeader img={img7} title="Groups" />
      <div id="content-page" className="content-page">
        <Container>
          <div className="d-grid gap-3 d-grid-template-1fr-19">
            {mygroups[document]?.data?.length > 0 ? ( // Lấy danh sách nhóm của người dùng
              mygroups[document]?.data?.map((group, index) => {
                const groupId = group?.group_id?.documentId; // Truy xuất group_id từ group_id
                const groupImage = group?.group_id?.image_group; // Truy xuất ảnh nhóm
                const groupName = group?.group_id?.group_name;
                const groupDescription = group?.group_id?.description;
                const groupDetails = findgroup[groupId]?.data; // Lấy thông tin chi tiết nhóm
                //console.log("groupDetails", groupDetails);

                const groupDetailsAvailable = groupDetails || {};

                // Lấy thành viên của nhóm hiện tại từ Redux
                const groupMembers = members[groupId]?.data || [];
                // Đảm bảo groupMembers là mảng trước khi gọi .slice()
                const validGroupMembers = Array.isArray(groupMembers)
                  ? groupMembers
                  : [];

                return (
                  <Card className="mb-0" key={groupId}>
                    <div className="top-bg-image">
                      <img
                        src={groupDetails?.media?.file_path}
                        className="img-fluid w-100"
                        alt="group-bg"
                        style={{ height: "350px" }}
                      />
                    </div>
                    <Card.Body className="text-center">
                      <div className="group-info pt-3 pb-3">
                        <h4>
                          <Link
                            to={`/group-detail/${groupId}`}
                            state={{ documentId: groupDetailsAvailable?.documentId }}
                          >
                            {groupName}
                          </Link>
                        </h4>
                        <p>{groupDescription}</p>
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <span className="material-symbols-outlined">
                            {groupDetails?.type?.name === "private" ? "lock" : "public"}
                          </span>
                          {groupDetails?.type?.name === "private" ? " Private Group" : " Public Group"}
                        </div>
                      </div>

                      <div className="group-details d-inline-block pb-3">
                        <ul className="d-flex align-items-center justify-content-between list-inline m-0 p-0">
                          <li className="pe-3 ps-3">
                            <p className="mb-0">Post</p>
                            <h6>{groupDetailsAvailable?.posts?.length || 0}</h6>
                          </li>
                          <li className="pe-3 ps-3">
                            <p className="mb-0">Member</p>
                            <h6>
                              {groupDetailsAvailable?.member_ids?.length || 0}
                            </h6>
                          </li>
                          <li className="pe-3 ps-3">
                            <p className="mb-0">Request</p>
                            <h6>{groupRequests[groupId] || 0}</h6>
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
                                  src={
                                    member?.users_id?.profile_picture || user05
                                  }
                                  alt="profile-img"
                                />
                              </Link>
                            ))}
                        </div>
                      </div>
                      <Link
                        to={`/group-detail/${groupId}`}
                        state={{ documentId: groupDetailsAvailable?.documentId }}>
                        <button
                          type="submit"
                          className="btn btn-primary d-block w-100"
                        >
                          Access
                        </button>
                      </Link>
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

export default MyGroups;
