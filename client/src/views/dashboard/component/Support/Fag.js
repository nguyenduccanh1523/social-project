import React, { useEffect } from "react";
import { Row, Col, Container, Tab, Nav, Accordion } from "react-bootstrap";
import Card from "../../../../components/Card";
import { Link } from "react-router-dom";

//profile-header
import ProfileHeader from "../../../../components/profile-header";

// image
import img1 from "../../../../assets/images/page-img/profile-bg2.jpg";
import { useDispatch, useSelector } from "react-redux";
import { fetchSupport } from "../../../../actions/actions";

const Faq = () => {
  const dispatch = useDispatch();
  const { support } = useSelector((state) => state.root.support || {});
  //console.log('support', support);

  useEffect(() => {
    dispatch(fetchSupport());
  }, [dispatch]);

  return (
    <>
      <ProfileHeader title="Faq" img={img1} />
      <div id="content-page" className="content-page">
        <Container>
          <Row>
            <Tab.Container id="left-tabs-example" defaultActiveKey="19">
              <Col lg={3}>
                <Card className="p-0">
                  <Card.Body className="p-0">
                    <div className="user-tabing">
                      <Nav
                        as="ul"
                        variant="pills"
                        className="d-flex flex-column align-items-start profile-feed-items p-0 m-0"
                      >
                        {support?.data?.map((item) => (
                          <Nav.Item as="li" className="col-12 p-0" key={item.id}>
                          <Nav.Link
                              href={`#pills-${item.id}-tab`}
                              eventKey={item.id}
                            role="button"
                              className="d-flex align-items-center p-3"
                          >
                              <span className="material-symbols-outlined me-2">{item.icon}</span>
                              {item.name}
                          </Nav.Link>
                        </Nav.Item>
                        ))}
                      </Nav>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={9}>
                <Tab.Content>
                  {support?.data?.map((item) => (
                    <Tab.Pane eventKey={item.id} key={item.id}>
                    <Container>
                      <Row>
                        <Col lg="12">
                            <Card className="bg-primary mb-3" style={{ height: "auto" }}>
                            <div className="inner-page-title">
                              
                                <h3> <span className="material-symbols-outlined me-2">{item.icon}</span> {item.name}</h3>
                                <p>{item?.description}</p>
                            </div>
                          </Card>
                            <Accordion style={{ marginTop: "90px" }} id="accordionExample" defaultActiveKey="0">
                            <Accordion.Item className="mb-3" eventKey="0">
                                <Accordion.Header id={`heading-${item.id}`}>
                                  Sample Question for {item.name}
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                    Sample answer for the question related to {item.title}.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                        </Col>
                      </Row>
                    </Container>
                  </Tab.Pane>
                  ))}
                </Tab.Content>
              </Col>
            </Tab.Container>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Faq;
