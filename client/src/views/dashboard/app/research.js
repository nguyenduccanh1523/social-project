import React, { useState, useEffect } from "react";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Card from "../../../components/Card";
import { useSelector } from "react-redux";
import { apiSearch } from "../../../services/search";
import img7 from "../../../assets/images/page-img/profile-bg1.jpg";

const Research = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("q") || "";
  const activeFilter = queryParams.get("type") || "all";

  const { token } = useSelector((state) => state.root.auth || {});

  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm) {
        setSearchResults(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setSearchResults(null); // Clear previous results to ensure clean state during loading
      try {
        const response = await apiSearch(searchTerm, token, activeFilter === "all" ? null : activeFilter);

        
        // Normalize the search results to ensure consistent structure
        const rawResults = response.data.data;
        const normalizedResults = {
          users: { data: [], total: 0 },
          groups: { data: [], total: 0 },
          events: { data: [], total: 0 },
          pages: { data: [], total: 0 },
          posts: { data: [], total: 0 },
        };

        const categories = ['users', 'groups', 'events', 'pages', 'posts'];

        // Map singular activeFilter to plural category name for consistency
        const getPluralCategory = (filter) => {
          switch (filter) {
            case 'user': return 'users';
            case 'group': return 'groups';
            case 'event': return 'events';
            case 'page': return 'pages';
            case 'post': return 'posts';
            default: return filter; // Should be 'all'
          }
        };

        // Scenario 1: rawResults is an object containing all categories (typical for 'all' filter)
        if (typeof rawResults === 'object' && rawResults !== null && categories.some(cat => rawResults.hasOwnProperty(cat))) {
          categories.forEach(category => {
            const categoryData = rawResults[category];
            if (categoryData) {
              if (Array.isArray(categoryData.data)) {
                normalizedResults[category] = {
                  data: categoryData.data,
                  total: categoryData.total || categoryData.data.length,
                };
              } else if (Array.isArray(categoryData)) { // Fallback if categoryData itself is an array
                normalizedResults[category] = {
                  data: categoryData,
                  total: categoryData.length,
                };
              }
            }
          });
        }
        // Scenario 2: rawResults is a direct array for a specific filter (e.g., when type=post)
        else if (Array.isArray(rawResults) && categories.includes(getPluralCategory(activeFilter))) {
          const pluralCategory = getPluralCategory(activeFilter);
          normalizedResults[pluralCategory] = {
            data: rawResults,
            total: rawResults.length,
          };
        }
        // Scenario 3: rawResults is an object with 'data' and 'total' for a specific filter
        else if (typeof rawResults === 'object' && rawResults !== null && rawResults.data !== undefined && categories.includes(getPluralCategory(activeFilter))) {
            const pluralCategory = getPluralCategory(activeFilter);
            normalizedResults[pluralCategory] = {
                data: rawResults.data,
                total: rawResults.total || rawResults.data.length,
            };
        }
        // Fallback: If rawResults structure is unexpected, all categories remain empty


        setSearchResults(normalizedResults);


      } catch (error) {
        setSearchResults(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchTerm, token, activeFilter, location.search]);

  const handleFilterClick = (filterType) => {
    navigate(`/search?q=${searchTerm}&type=${filterType}`);
  };

  const renderPeopleResults = () => {
    const usersData = searchResults?.users?.data || [];
    const usersTotal = searchResults?.users?.total || 0;


    if (usersData.length === 0) {
      return <p>No one found.</p>;
    }

    const displayedUsers = activeFilter === "all" ? usersData.slice(0, 5) : usersData;

    return (
      <Row>
        {displayedUsers.map((user) => (
          <Col md="6" lg="4" key={user.documentId || user._id}>
            <Card className="text-center">
              <Card.Body>
                <Link to={`/friend-profile/${user.documentId || user._id}`}>
                  <img
                    src={user.avatar?.file_path || img7}
                    alt="profile-img"
                    className="rounded-circle img-fluid avatar-80 mb-3"
                  />
                </Link>
                <h4>{user.fullname}</h4>
                <p className="text-primary">@{user.username}</p>
                <Button variant="primary" size="sm" className="mt-2">
                  View profile
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
        {activeFilter === "all" && usersTotal > 5 && (
          <Col md="12" className="text-center mt-3">
            <Link to={`/search?q=${searchTerm}&type=user`}>
              <Button variant="primary">View all People</Button>
            </Link>
          </Col>
        )}
        {activeFilter !== "all" && usersTotal > usersData.length && (
          <Col md="12" className="text-center mt-3">
            <Button variant="primary">View all</Button>
          </Col>
        )}
      </Row>
    );
  };

  const renderGroupResults = () => {
    const groupsData = searchResults?.groups?.data || [];
    const groupsTotal = searchResults?.groups?.total || 0;


    if (groupsData.length === 0) {
      return <p>No groups found.</p>;
    }

    const displayedGroups = activeFilter === "all" ? groupsData.slice(0, 5) : groupsData;

    return (
      <Row>
        {displayedGroups.map((group) => (
          <Col md="6" lg="4" key={group.documentId || group._id}>
            <Card className="text-center">
              <Card.Body>
                <Link to={`/group-detail/${group.documentId || group._id}`}>
                  <img
                    src={group.image?.file_path || img7}
                    alt="group-img"
                    className="rounded-circle img-fluid avatar-80 mb-3"
                  />
                </Link>
                <h4>{group.group_name}</h4>
                <p className="text-primary">{group.description}</p>
                <Button variant="primary" size="sm" className="mt-2">
                  View group
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
        {activeFilter === "all" && groupsTotal > 5 && (
          <Col md="12" className="text-center mt-3">
            <Link to={`/search?q=${searchTerm}&type=group`}>
              <Button variant="primary">View all Groups</Button>
            </Link>
          </Col>
        )}
        {activeFilter !== "all" && groupsTotal > groupsData.length && (
          <Col md="12" className="text-center mt-3">
            <Button variant="primary">View all</Button>
          </Col>
        )}
      </Row>
    );
  }

  const renderPostResults = () => {
    const postsData = searchResults?.posts?.data || [];
    const postsTotal = searchResults?.posts?.total || 0;

    if (postsData.length === 0) {
      return <p>No posts found.</p>;
    }

    const displayedPosts = activeFilter === "all" ? postsData.slice(0, 5) : postsData;

    return (
      <Row>
        {displayedPosts.map((post) => {
          if (!post) return null; // Handle potential null/undefined items in the array
          const postContent = post?.content; // Use optional chaining for content
          const displayedContent = typeof postContent === 'string' ? postContent.substring(0, 50) : 'No content available';

          return (
            <Col md="6" lg="4" key={post.documentId || post._id}>
              <Card className="text-center">
                <Card.Body>
                  <h4>{displayedContent}...</h4>
                  <p className="text-muted">Posted on: {new Date(post.created_at || '').toLocaleDateString()}</p>
                  <Button variant="primary" size="sm" className="mt-2">
                    View post
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
        {activeFilter === "all" && postsTotal > 5 && (
          <Col md="12" className="text-center mt-3">
            <Link to={`/search?q=${searchTerm}&type=post`}>
              <Button variant="primary">View all Posts</Button>
            </Link>
          </Col>
        )}
        {activeFilter !== "all" && postsTotal > postsData.length && (
          <Col md="12" className="text-center mt-3">
            <Button variant="primary">View all</Button>
          </Col>
        )}
      </Row>
    );
  };

  const renderPageResults = () => {
    const pagesData = searchResults?.pages?.data || [];
    const pagesTotal = searchResults?.pages?.total || 0;


    if (pagesData.length === 0) {
      return <p>No pages found.</p>;
    }

    const displayedPages = activeFilter === "all" ? pagesData.slice(0, 5) : pagesData;

    return (
      <Row>
        {displayedPages.map((page) => (
          <Col md="6" lg="4" key={page.documentId || page._id}>
            <Card className="text-center">
              <Card.Body>
                <Link to={`/page-detail/${page.documentId || page._id}`}>
                  <img
                    src={page.profileImage?.file_path || img7}
                    alt="page-profile-img"
                    className="rounded-circle img-fluid avatar-80 mb-3"
                  />
                </Link>
                <h4>{page.page_name}</h4>
                <p className="text-primary">{page.intro}</p>
                <Button variant="primary" size="sm" className="mt-2">
                  View page
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
        {activeFilter === "all" && pagesTotal > 5 && (
          <Col md="12" className="text-center mt-3">
            <Link to={`/search?q=${searchTerm}&type=page`}>
              <Button variant="primary">View all Pages</Button>
            </Link>
          </Col>
        )}
        {activeFilter !== "all" && pagesTotal > pagesData.length && (
          <Col md="12" className="text-center mt-3">
            <Button variant="primary">View all</Button>
          </Col>
        )}
      </Row>
    );
  };

  const renderEventResults = () => {
    const eventsData = searchResults?.events?.data || [];
    const eventsTotal = searchResults?.events?.total || 0;


    if (eventsData.length === 0) {
      return <p>No events found.</p>;
    }

    const displayedEvents = activeFilter === "all" ? eventsData.slice(0, 5) : eventsData;

    return (
      <Row>
        {displayedEvents.map((event) => (
          <Col md="6" lg="4" key={event.documentId || event._id}>
            <Card className="text-center">
              <Card.Body>
                <Link to={`/event-detail/${event.documentId || event._id}`}>
                  <img
                    src={event.image?.file_path || img7}
                    alt="event-img"
                    className="rounded-circle img-fluid avatar-80 mb-3"
                  />
                </Link>
                <h4>{event.name}</h4>
                <p className="text-primary">{event.description || "No description"}</p>
                <p className="mb-0">
                  <small>Time: {new Date(event.start_time).toLocaleDateString()} - {new Date(event.end_time).toLocaleDateString()}</small>
                </p>
                <Button variant="primary" size="sm" className="mt-2">
                  View event
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
        {activeFilter === "all" && eventsTotal > 5 && (
          <Col md="12" className="text-center mt-3">
            <Link to={`/search?q=${searchTerm}&type=event`}>
              <Button variant="primary">View all Events</Button>
            </Link>
          </Col>
        )}
        {activeFilter !== "all" && eventsTotal > eventsData.length && (
          <Col md="12" className="text-center mt-3">
            <Button variant="primary">View all</Button>
          </Col>
        )}
      </Row>
    );
  };

  return (
    <>
      <div id="content-page" className="content-page">
        <Container>
          <Row>
            <Col lg="12">
              <h2 className="mb-4">Search results for "{searchTerm}"</h2>
              <Nav variant="tabs" className="mb-4 d-flex justify-content-start flex-wrap">
                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    to={`/search?q=${searchTerm}&type=all`}
                    active={activeFilter === "all"}
                    onClick={() => handleFilterClick("all")}
                  >
                    All
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    to={`/search?q=${searchTerm}&type=user`}
                    active={activeFilter === "user"}
                    onClick={() => handleFilterClick("user")}
                  >
                    People
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    to={`/search?q=${searchTerm}&type=post`}
                    active={activeFilter === "post"}
                    onClick={() => handleFilterClick("post")}
                  >
                    Posts
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    to={`/search?q=${searchTerm}&type=page`}
                    active={activeFilter === "page"}
                    onClick={() => handleFilterClick("page")}
                  >
                    Pages
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    to={`/search?q=${searchTerm}&type=group`}
                    active={activeFilter === "group"}
                    onClick={() => handleFilterClick("group")}
                  >
                    Groups
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    to={`/search?q=${searchTerm}&type=event`}
                    active={activeFilter === "event"}
                    onClick={() => handleFilterClick("event")}
                  >
                    Events
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              {loading ? (
                <div className="text-center">Loading results...</div>
              ) : (
                <>
                  {searchTerm === "" ? (
                    <div className="text-center">Please enter keywords to search.</div>
                  ) : (
                    <>
                      {(activeFilter === "all" || activeFilter === "user") && (
                        <div className="mb-5">
                          <h3>People</h3>
                          {renderPeopleResults()}
                        </div>
                      )}
                      {(activeFilter === "all" || activeFilter === "post") && (
                        <div className="mb-5">
                          <h3>Posts</h3>
                          {renderPostResults()}
                        </div>
                      )}
                      {(activeFilter === "all" || activeFilter === "page") && (
                        <div className="mb-5">
                          <h3>Pages</h3>
                          {renderPageResults()}
                        </div>
                      )}
                      {(activeFilter === "all" || activeFilter === "group") && (
                        <div className="mb-5">
                          <h3>Groups</h3>
                          {renderGroupResults()}
                        </div>
                      )}
                      {(activeFilter === "all" || activeFilter === "event") && (
                        <div className="mb-5">
                          <h3>Events</h3>
                          {renderEventResults()}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Research;
