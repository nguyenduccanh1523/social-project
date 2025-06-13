import React from "react";
import { Link } from "react-router-dom";
const ProfileMessager = ({ user }) => {
  // Kiểm tra group: có participants là mảng
  const avatarSrc = user?.avatarMedia?.file_path || user?.groupImage?.file_path;
  const isGroup = Array.isArray(user?.participants) && user?.participants.length > 0;

  if (isGroup) {
    return (
      <>
        <div className="user text-center mb-4">
          <Link className="avatar m-0" to="">
            <img
              loading="lazy"
              src={avatarSrc}
              alt="avatar"
              className="avatar-130 "
            />
          </Link>
          <h4 className="text-center mt-4 mb-2">{user?.name || user?.username}</h4>
          <div className="user-desc">
            <p className="text-center">Group chat</p>
          </div>
        </div>
        <hr />
        <div className="user-detail text-left mt-4 ps-4 pe-4">
          <h5 className="mb-3">Member Group</h5>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
            {user.participants.map((p, idx) => (
              <div key={p.user?.documentId || idx} style={{ textAlign: 'center', width: 80 }}>
                <img
                  src={p.user?.avatarMedia?.file_path}
                  alt={p.user?.fullname}
                  style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', marginBottom: 4, border: p.isAdmin ? '2px solid #f7b731' : '1px solid #eee' }}
                />
                <div style={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.user?.fullname || p.user?.username}
                </div>
                {p.isAdmin && (
                  <div style={{ color: '#f7b731', fontSize: 11, fontWeight: 600, marginTop: 2 }}>
                    <span role="img" aria-label="admin">👑</span> Admin
                  </div>
                )}
                {!p.isAdmin && (
                  <div style={{ color: '#888', fontSize: 11, marginTop: 2 }}>
                    Member
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // Trường hợp user cá nhân (giữ nguyên như cũ)
  
  return (
    <>
      <div className="user text-center mb-4">
        <Link className="avatar m-0" to="">
          <img
            loading="lazy"
            src={avatarSrc}
            alt="avatar"
            className="avatar-130 "
          />
        </Link>
        <div className="user-name mt-4">
          <h4 className="text-center">{user?.username || user?.name}</h4>
        </div>
        <div className="user-desc">
          <p className="text-center">Online</p>
        </div>
      </div>
      <hr />
      <div className="user-detail text-left mt-4 ps-4 pe-4">
        <h5 className="mt-4 mb-4">About</h5>
        <p>
          {user?.about}
        </p>
        <h5 className="mt-3 mb-3">Infomation</h5>
        <ul className="user-status p-0">
          <li className="mb-1">
            <i className="ri-checkbox-blank-circle-fill text-success pe-1"></i>
            <span>Phone: {user?.phone}</span>
          </li>
          <li className="mb-1">
            <i className="ri-checkbox-blank-circle-fill text-warning pe-1"></i>
            <span>Email: {user?.email}</span>
          </li>
          <li className="mb-1">
            <i className="ri-checkbox-blank-circle-fill text-danger pe-1"></i>
            <span>Birthday: {user?.date_of_birth}</span>
          </li>
          <li className="mb-1">
            <i className="ri-checkbox-blank-circle-fill text-light pe-1"></i>
            <span>Live: {user?.nation?.name}</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ProfileMessager;
