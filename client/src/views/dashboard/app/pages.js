import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Input, Pagination } from "antd";
import { useNavigate } from 'react-router-dom';
import Card from "../../../components/Card";
import ProfileHeader from "../../../components/profile-header";
import img7 from "../../../assets/images/page-img/profile-bg1.jpg";
import { useDispatch, useSelector } from "react-redux";
import { fetchTag } from "../../../actions/actions/tag";
import { tagIcons, tagColorMap } from "../icons/frontendIcon.js/iconTags.js";
import { apiGetPageTag, apiGetTag } from "../../../services/tag";
import { useQuery } from '@tanstack/react-query';
import * as AntdIcons from '@ant-design/icons';

const { Search } = Input;

const Pages = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tags } = useSelector((state) => state.root.tag || {});
  const { token } = useSelector((state) => state.root.auth || {});
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    dispatch(fetchTag(token));
  }, [dispatch]);

  // const { data: TagsDatas, isLoading: TagsData } = useQuery({
  //   queryKey: ['tagsData', token],
  //   queryFn: () => apiGetTag({ token }),
  //   enabled: !!token,
  //   onSuccess: (data) => {
  //     console.log("User data fetched successfully:", data);
  //   },
  //   onError: (error) => {
  //     console.error("Error fetching user data:", error);
  //   }
  // });
  
  // console.log('sssssstags ', TagsDatas)
  // const tags = TagsDatas || {};
  // console.log('tags ', tags)


  // Lọc tags theo searchText
  const filteredTags = tags?.data?.filter(tag => {
    const searchLower = searchText.toLowerCase().trim();
    return !searchText || tag?.name?.toLowerCase().includes(searchLower);
  });

  const { data: pageCounts, refetch: refetchPageCounts } = useQuery({
    queryKey: ['pageCounts', filteredTags],
    queryFn: async () => {
      const counts = {};
      if (filteredTags) {
        for (const tag of filteredTags) {
          try {
            const response = await apiGetPageTag({ tagId: tag.documentId, token });
            console.log(response)
            counts[tag.documentId] = response.data?.data.length;
          } catch (error) {
            console.error("Error fetching page count for tag:", tag.name, error);
          }
        }
      }
      return counts;
    },
    enabled: !!filteredTags
  });


  useEffect(() => {
    refetchPageCounts();
  }, [filteredTags, refetchPageCounts]);

  //Tính toán tags cho trang hiện tại từ danh sách đã lọc
  const getCurrentPageTags = () => {
    if (!filteredTags) return [];
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTags.slice(startIndex, startIndex + pageSize);
  };
  

  // Xử lý khi search thay đổi
  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1); // Reset về trang 1 khi search
  };

  // Render icon dựa trên tên tag
  const renderTagIcon = (tagName) => {
    if (!tagName) return <AntdIcons.TagOutlined />;
    
    // Lấy tên icon từ mapping
    const iconName = tagIcons[tagName] || tagIcons.default;
    
    // Lấy component icon từ Ant Design
    const IconComponent = AntdIcons[iconName];
    
    // Trả về icon nếu tồn tại, hoặc icon mặc định nếu không tìm thấy
    return IconComponent ? <IconComponent /> : <AntdIcons.TagOutlined />;
  };

  // Xử lý click vào tag
  const handleTagClick = (tag) => {
    //console.log("Tag clicked:", tag);
    if (!tag?.documentId) {
      console.error('Tag ID is missing');
      return;
    }
    
    navigate(`/page-lists/${tag?.name}`, { 
      state: { 
        selectedTag: tag,
        tagName: tag?.name,
        tagId: tag?.documentId
      } 
    });
  };

  
  return (
    <>
      <ProfileHeader title="Pages" img={img7} />
      <div id="content-page" className="content-page">
        <Container>
          <Row className="mb-3">
            <Col lg="12">
              <Card>
                <Card.Body>
                  <Search
                    placeholder="Search tag..."
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
            <div className="mb-3">
              <h4>Popular tags</h4>
              <p>Explore the most used tags in TalkC SocialV</p>
            </div>
            {getCurrentPageTags().map((tag) => {
              // Lấy theme màu dựa trên tên tag
              const theme = tagColorMap[tag?.name] || tagColorMap.default;
              return (
                <Col sm="6" md="4" key={tag.id}>
                  <div 
                    className="cardhover" 
                    onClick={() => handleTagClick(tag)}
                    role="button"
                  >
                    <Card>
                      <Card.Body>
                        <div className="icon-wrapper mb-2">
                          <span 
                            style={{ 
                              color: theme.primary,
                              fontSize: '28px',
                            }}
                          >
                            {renderTagIcon(tag?.name)}
                          </span>
                        </div>
                        <h5 style={{ color: theme.primary }}>{tag.name}</h5>
                        <small>Built by HubSpot</small>
                        <div className="mt-2">
                          <p className="mb-0">
                            {tag.description || "No description available"}
                          </p>
                        </div>
                        <small className="mt-2 d-block">
                          <span>
                            <span>{pageCounts?.[tag.documentId] || 0}</span>+ pages
                          </span>
                        </small>
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              );
            })}
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

// CSS cho card và icon
const style = document.createElement('style');
style.textContent = `
  .cardhover {
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    margin-bottom: 20px;
  }
  .cardhover:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }
  .icon-wrapper {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
  }
  .icon-wrapper span {
    display: flex;
    align-items: center;
  }
  .cardhover:hover .icon-wrapper {
    animation: bounce 0.5s;
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
`;
document.head.appendChild(style);

export default Pages;
