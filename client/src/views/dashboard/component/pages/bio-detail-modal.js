import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { apiGetPageHour } from "../../../../services/page";

const BioDetailModal = ({ show, onHide, pageData }) => {
  const [pageHour, setPageHour] = useState(null);

  // Lấy thông tin giờ mở cửa
  useEffect(() => {
    if (pageData?.page_open_hour?.documentId) {
      apiGetPageHour({ pageId: pageData.page_open_hour.documentId }).then(
        (res) => {
          setPageHour(res.data);
        }
      );
    }
  }, [pageData?.page_open_hour?.documentId]);

  // Tạo chuỗi hiển thị giờ mở cửa
  const getOpenHourString = () => {
    if (!pageHour) return "Updating...";

    // Cắt bỏ phần .000 từ chuỗi thời gian
    const openTime = pageHour?.data?.open_time?.split(".")[0]; // "05:50:00"
    const closeTime = pageHour?.data?.close_time?.split(".")[0];
    const isOpen = pageHour?.data?.status_open;

    return (
      <div>
        <div className="d-flex align-items-center">
          <span className={`me-2 ${isOpen ? "text-success" : "text-danger"}`}>
            {isOpen ? "● Opened" : "● Closed"}
          </span>
        </div>
        <div className="mt-1">
          {openTime} - {closeTime}
        </div>
      </div>
    );
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" style={{ marginTop: "70px" }}>
      <Modal.Header className="d-flex justify-content-between">
        <h5 className="modal-title">{pageData?.page_name}</h5>
        <Link className="lh-1" to="#" onClick={onHide}>
          <span className="material-symbols-outlined">close</span>
        </Link>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column">
          <div className="mb-4">
            <h5>About</h5>
            <h6>{pageData?.intro}</h6>
            <span>{pageData?.about}</span>
          </div>

          <div className="mb-4">
            <h5>Information</h5>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex align-items-center">
                <span className="material-symbols-outlined md-18">
                  business_center
                </span>
                <Link to="#" className="link-primary h6 ms-2 mb-0">
                  {pageData?.business_info || "Model at next model management"}
                </Link>
              </div>
              <div className="d-flex align-items-center">
                <span className="material-symbols-outlined md-18">
                  location_on
                </span>
                <span className="ms-2">
                  {pageData?.lives_in ||
                    "Tầng 4, Tòa Luxury Park Views, Lô 32, Cầu Giấy, Hanoi, Vietnam"}
                </span>
              </div>
              <div className="d-flex align-items-center">
                <span className="material-symbols-outlined md-18">call</span>
                <span className="ms-2">
                  {pageData?.phone || "098 366 30 92"}
                </span>
              </div>
              <div className="d-flex align-items-center">
                <span className="material-symbols-outlined md-18">mail</span>
                <span className="ms-2">
                  {pageData?.email || "Sales@kenh28.vn"}
                </span>
              </div>
              <div className="d-flex align-items-center">
                <span className="material-symbols-outlined md-18">
                  language
                </span>
                <Link to="#" className="link-primary ms-2">
                  {pageData?.website || "theanh28.vn"}
                </Link>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h5>Contact More</h5>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex align-items-center">
                <span className="material-symbols-outlined md-18">
                  schedule
                </span>
                <span className="ms-2">{getOpenHourString()}</span>
              </div>
              <div className="d-flex align-items-center mt-1">
                <span className="material-symbols-outlined md-18 me-1">
                  calendar_today
                </span>
                <span>{pageHour?.data?.day}</span>
              </div>
              <div className="d-flex align-items-center">
                <span className="material-symbols-outlined md-18">star</span>
                <span className="ms-2 mt-1">
                  {pageData?.star || "5.0"} star
                </span>
              </div>
              <div className="d-flex align-items-center">
                <span className="material-symbols-outlined md-18">group</span>
                <span className="ms-2">
                  {pageData?.followers_count || "0"} followers
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default BioDetailModal;
