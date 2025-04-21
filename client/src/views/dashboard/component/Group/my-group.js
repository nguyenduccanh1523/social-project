import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Card from "../../../../components/Card";
import { Link } from "react-router-dom";
import ProfileHeader from "../../../../components/profile-header";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { apiGetGroupRequest } from "../../../../services/groupServices/groupRequest";
import Create from "../../icons/uiverse/Create";
import CreateGroup from "./createGroup";
import { apiGetMyGroup, apiFindOneGroup, apiMyAdminGroup } from "../../../../services/groupServices/group"; // Import the new API
import { Pagination as AntPagination } from "antd"; // Use Ant Design's Pagination component

// images
import user05 from "../../../../assets/images/user/05.jpg";
import img7 from "../../../../assets/images/page-img/profile-bg7.jpg";
import { apiGetGroupMembers } from "../../../../services/groupServices/groupMembers";

const MyGroups = () => {
  const { token } = useSelector((state) => state.root.auth || {});
  const { user } = useSelector((state) => state.root.auth || {});
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pageSize = 6;

  const fetchGroups = async () => {
    if (!user?.documentId) return [];

    const [myGroupsRes, adminGroupsRes] = await Promise.all([
      apiGetMyGroup({ userId: user.documentId, token }),
      apiMyAdminGroup({ userId: user.documentId, token })
    ]);

    const myGroups = myGroupsRes?.data?.data || [];
    const adminGroups = adminGroupsRes?.data?.data || [];
    // console.log("My Groups:", myGroups);
    // console.log("Admin Groups:", adminGroups);

    // Dùng Map để tránh trùng lặp
    const groupMap = new Map();

    // Thêm từ myGroups trước
    for (const group of myGroups) {
      const groupId = group?.group?.documentId;
      if (!groupId) continue;
      groupMap.set(groupId, {
        group: group?.group,
        admin: false
      });
    }

    // Gộp thêm adminGroups, nếu trùng thì gán admin = true
    for (const adminGroup of adminGroups) {
      const groupId = adminGroup?.documentId;
      if (!groupId) continue;

      if (groupMap.has(groupId)) {
        const existingGroup = groupMap.get(groupId);
        groupMap.set(groupId, {
          ...existingGroup,
          admin: true // Ưu tiên cập nhật admin nếu trùng
        });
      } else {
        // Nếu chưa có, tạo mới với admin = true và chuẩn hóa cấu trúc
        groupMap.set(groupId, {
          group: adminGroup, // Để đảm bảo nhất quán, đặt adminGroup vào thuộc tính group
          admin: true
        });
      }
    }

    const groups = Array.from(groupMap.values());

    const groupRequests = {};
    const groupDetails = {};
    const groupMembers = {};

    for (const group of groups) {
      const groupId = group?.group?.documentId;
      

      if (!groupId) continue; // Bỏ qua nếu không có groupId

      const [requestResponse, detailResponse, memberResponse] = await Promise.all([
        apiGetGroupRequest({ groupId, token }),
        apiFindOneGroup({ groupId, token }),
        apiGetGroupMembers({ groupId, token })
      ]);

      groupRequests[groupId] = requestResponse?.data?.data?.length || 0;
      groupDetails[groupId] = detailResponse?.data?.data || {};
      groupMembers[groupId] = memberResponse?.data?.data || [];
    }

    return { groups, groupRequests, groupDetails, groupMembers };
  };


  const { data, isLoading } = useQuery({
    queryKey: ["myGroups", user?.documentId],
    queryFn: fetchGroups,
    enabled: !!user?.documentId,
  });

  if (isLoading) return <p>Loading...</p>;

  const { groups = [], groupRequests = {}, groupDetails = {}, groupMembers = {} } = data || {};
  const paginatedGroups = groups.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <ProfileHeader img={img7} title="Groups" />
      <div id="content-page" className="content-page">
        <Container>
          <div className="mb-2" onClick={() => setDrawerOpen(true)}>
            <Create />
          </div>
          <CreateGroup open={drawerOpen} onClose={() => setDrawerOpen(false)} />
          <div className="d-grid gap-3 d-grid-template-1fr-19">
            {paginatedGroups.length > 0 ? (
              paginatedGroups.map((group) => {
                // Lấy groupId một cách nhất quán từ cấu trúc đã chuẩn hóa
                const groupId = group?.group?.documentId;
                if (!groupId) return null; // Bỏ qua nếu không có groupId
                
                // Lấy thông tin từ group object
                const groupData = group?.group || {};
                const groupName = groupData?.group_name;
                const groupDescription = groupData?.description;
                
                // Lấy thông tin chi tiết từ API
                const groupDetailsData = groupDetails[groupId] || {};
                
                const groupMembersList = groupMembers[groupId] || [];

                return (
                  <Card className="mb-0" key={groupId} style={{ position: "relative" }}>
                    {group.admin && (
                      <div
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          background: "#28a745",
                          color: "#fff",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          zIndex: 1,
                        }}
                      >
                        Admin
                      </div>
                    )}
                    <div className="top-bg-image">
                      <img
                        src={groupDetailsData?.image?.file_path}
                        className="img-fluid w-100"
                        alt="group-bg"
                        style={{ height: "350px" }}
                      />
                    </div>
                    <Card.Body className="text-center">
                      <div className="group-info pt-3 pb-3">
                        <h4>
                          <Link to={`/group-detail/${groupId}`} state={{ documentId: groupId }}>
                            {groupName || groupDetailsData?.group_name}
                          </Link>
                        </h4>
                        <p>{groupDescription || groupDetailsData?.description}</p>
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <span className="material-symbols-outlined">
                            {groupDetailsData?.type?.name === "private" ? "lock" : "public"}
                          </span>
                          {groupDetailsData?.type?.name === "private" ? " Private Group" : " Public Group"}
                        </div>
                      </div>

                      <div className="group-details d-inline-block pb-3">
                        <ul className="d-flex align-items-center justify-content-between list-inline m-0 p-0">
                          <li className="pe-3 ps-3">
                            <p className="mb-0">Post</p>
                            <h6>{groupDetailsData?.posts?.length}</h6>
                          </li>
                          <li className="pe-3 ps-3">
                            <p className="mb-0">Member</p>
                            <h6>{groupMembersList.length}</h6>
                          </li>
                          <li className="pe-3 ps-3">
                            <p className="mb-0">Request</p>
                            <h6>{groupRequests[groupId] || 0}</h6>
                          </li>
                        </ul>
                      </div>
                      <div className="group-member mb-3">
                        <div className="iq-media-group">
                          {groupMembersList.slice(0, 6).map((member, index) => (
                            <Link to="#" className="iq-media" key={index}>
                              <img
                                className="img-fluid avatar-40 rounded-circle"
                                src={member?.user?.avatarMedia?.file_path || user05}
                                alt="profile-img"
                              />
                            </Link>
                          ))}
                        </div>
                      </div>
                      <Link to={`/group-detail/${groupId}`} state={{ documentId: groupId }}>
                        <button type="submit" className="btn btn-primary d-block w-100">
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
          <AntPagination
            className="mt-3"
            current={currentPage}
            total={groups.length}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false} // Ensure no invalid props are passed
          />
        </Container>
      </div>
    </>
  );
};

export default MyGroups;
