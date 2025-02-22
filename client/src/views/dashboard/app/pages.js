import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Input, Pagination, Tag } from "antd";
import Card from "../../../components/Card";
import ProfileHeader from "../../../components/profile-header";
import img7 from "../../../assets/images/page-img/profile-bg1.jpg";
import { useDispatch, useSelector } from "react-redux";
import { fetchTag } from "../../../actions/actions/tag";
import { colorsTag } from "../others/format";

const { Search } = Input;

const Pages = () => {
  const dispatch = useDispatch();
  const { tags } = useSelector((state) => state.root.tag || {});
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // Số tag hiển thị trên mỗi trang

  useEffect(() => {
    dispatch(fetchTag());
  }, [dispatch]);

  // Tính toán tags cho trang hiện tại
  const getCurrentPageTags = () => {
    if (!tags?.data) return [];
    const startIndex = (currentPage - 1) * pageSize;
    return tags.data.slice(startIndex, startIndex + pageSize);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  // Filter tags theo search text
  const filteredTags = tags?.data?.filter(tag => 
    !searchText || 
    tag.attributes.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <ProfileHeader img={img7} title="Pages" />
      <div id="content-page" className="content-page">
        <Container>
          <Row className="mb-3">
            <Col lg="12">
              <Card>
                <Card.Body>
                  <Search
                    placeholder="Search pages or tags..."
                    allowClear
                    enterButton="Search"
                    size="large"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onSearch={handleSearch}
                    style={{ width: 400 }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Row>
            <div className="mb-3">
              <h4>Popular apps</h4>
              <p>Explore the most installed apps in the HubSpot Marketplace</p>
            </div>
            {getCurrentPageTags().map((tag, index) => (
              <Col sm="6" md="4" key={tag.id}>
                <Card className="cardhover">
                  <Card.Body>
                    <Tag 
                      color={colorsTag[index % colorsTag.length]}
                      style={{ fontSize: '1rem', padding: '5px 10px', marginBottom: '10px' }}
                    >
                      {tag.attributes.name}
                    </Tag>
                    <h5>{tag.attributes.name}</h5>
                    <small>Built by HubSpot</small>
                    <div className="mt-2">
                      <p className="mb-0">{tag.attributes.description || 'No description available'}</p>
                    </div>
                    <span className="text-warning d-flex align-items-center line-height mt-2">
                      <i className="material-symbols-outlined md-18 me-1">star</i>
                      <i className="material-symbols-outlined md-18 me-1">star</i>
                      <i className="material-symbols-outlined md-18 me-1">star</i>
                      <i className="material-symbols-outlined md-18 me-1">star</i>
                      <i className="material-symbols-outlined md-18 text-gray me-1">star</i>
                      <small className="text-dark">{tag.attributes.rating || 0}</small>
                    </span>
                    <small className="mt-2 d-block">
                      <span>{tag.attributes.pageCount || 0} pages</span>
                    </small>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Row className="mt-3">
            <Col lg="12" className="d-flex justify-content-end">
              <Pagination
                current={currentPage}
                total={filteredTags?.length || 0}
                pageSize={pageSize}
                onChange={setCurrentPage}
                showSizeChanger={false}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Pages;
