import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import Card from "../../../../components/Card";
import { Link } from "react-router-dom";

//profile-header
import ProfileHeader from "../../../../components/profile-header";

// image
import img2 from "../../../../assets/images/page-img/profile-bg1.jpg";

const Guider = () => {
  return (
    <>
      <ProfileHeader title="Guider" img={img2} />
      <div id="content-page" className="content-page">
        <Container>
          <Row>
            <Col sm="6" md="4">
              <div
                className="cardhover"
                //onClick={() => handleTagClick(tag)}
                role="button"
              >
                <Card>
                  <Card.Body>
                    <div className="icon-wrapper mb-2">
                      <i
                        className="material-symbols-outlined"
                        style={{
                          //background: theme.gradient,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {/* {getTagIcon(tag?.name)} */} canh
                      </i>
                    </div>
                    {/* <h5 style={{ color: theme.primary }}>{tag.name}</h5> */}
                    <small>Built by HubSpot</small>
                    <div className="mt-2">
                      <p className="mb-0">
                        {/* {tag.description || "No description available"} */}s
                      </p>
                    </div>
                    <small className="mt-2 d-block">
                      <span>
                        <span>0</span>+ pages
                      </span>
                    </small>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Guider;
