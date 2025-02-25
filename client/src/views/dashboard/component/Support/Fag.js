import React from "react";
import { Row, Col, Container, Tab, Nav, Accordion } from "react-bootstrap";
import Card from "../../../../components/Card";
import { Link } from "react-router-dom";

//profile-header
import ProfileHeader from "../../../../components/profile-header";

// image
import img1 from "../../../../assets/images/page-img/profile-bg2.jpg";

const Faq = () => {
  return (
    <>
      <ProfileHeader title="Faq" img={img1} />
      <div id="content-page" className="content-page">
        <Container>
          <Row>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
              <Col lg={3}>
                <Card className="p-0">
                  <Card.Body className="p-0">
                    <div className="user-tabing">
                      <Nav
                        as="ul"
                        variant="pills"
                        className="d-flex flex-column align-items-start profile-feed-items p-0 m-0"
                      >
                        <Nav.Item as="li" className="col-12 p-0">
                          <Nav.Link
                            href="#pills-timeline-tab"
                            eventKey="first"
                            role="button"
                            className="text-center p-3"
                          >
                            Discussion
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li" className="col-12 p-0">
                          <Nav.Link
                            href="#pills-about-tab"
                            eventKey="second"
                            role="button"
                            className="text-center p-3"
                          >
                            Post
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li" className="col-12 p-0">
                          <Nav.Link
                            href="#pills-friends-tab"
                            eventKey="third"
                            role="button"
                            className="text-center p-3"
                          >
                            Page
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li" className="col-12 p-0">
                          <Nav.Link
                            href="#pills-photos-tab"
                            eventKey="forth"
                            role="button"
                            className="text-center p-3"
                          >
                            Document
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li" className="col-12 p-0">
                          <Nav.Link
                            href="#pills-photos-tab"
                            eventKey="forth"
                            role="button"
                            className="text-center p-3"
                          >
                            Change Password
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li" className="col-12 p-0">
                          <Nav.Link
                            href="#pills-photos-tab"
                            eventKey="forth"
                            role="button"
                            className="text-center p-3"
                          >
                            Portfolio
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li" className="col-12 p-0">
                          <Nav.Link
                            href="#pills-photos-tab"
                            eventKey="forth"
                            role="button"
                            className="text-center p-3"
                          >
                            Group
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li" className="col-12 p-0">
                          <Nav.Link
                            href="#pills-photos-tab"
                            eventKey="forth"
                            role="button"
                            className="text-center p-3"
                          >
                            Blog
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li" className="col-12 p-0">
                          <Nav.Link
                            href="#pills-photos-tab"
                            eventKey="forth"
                            role="button"
                            className="text-center p-3"
                          >
                            Story
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <Container>
                      <Row>
                        <Col lg="12">
                          <Card
                            className="bg-primary mb-3"
                            style={{ height: "auto" }}
                          >
                            <div className="inner-page-title">
                              <h3>Faq Page</h3>
                              <p>lorem ipsum</p>
                            </div>
                          </Card>
                          <Accordion
                            style={{ marginTop: "90px" }}
                            id="accordionExample"
                            defaultActiveKey="0"
                          >
                            <Accordion.Item className="mb-3" eventKey="0">
                              <Accordion.Header id="heading1">
                                It is a long established reader will be?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  Many desktop publishing packages and web page
                                  editors now use Lorem Ipsum as their default
                                  model text, and a search for 'lorem ipsum'
                                  will uncover many web sites still in their
                                  infancy.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="1">
                              <Accordion.Header id="heading2">
                                Distracted by the readable page whent?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="2">
                              <Accordion.Header id="heading3">
                                What is user interface kit?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="3">
                              <Accordion.Header id="heading4">
                                The readable content layout?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="4">
                              <Accordion.Header id="heading5">
                                The readable content of a page at its layout?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="5">
                              <Accordion.Header id="heading6">
                                What is user interface kit?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="6">
                              <Accordion.Header id="heading7">
                                The readable content and survived?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="7">
                              <Accordion.Header id="heading8">
                                The readable content of a page layout?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="8">
                              <Accordion.Header id="heading9">
                                Distracted by readable content of a page?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                        </Col>
                      </Row>
                    </Container>
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <Container>
                      <Row>
                        <Col lg="12">
                          <Card
                            className="bg-primary mb-3"
                            style={{ height: "auto" }}
                          >
                            <div className="inner-page-title">
                              <h3>Faq Page</h3>
                              <p>lorem ipsum</p>
                            </div>
                          </Card>
                          <Accordion
                            style={{ marginTop: "90px" }}
                            id="accordionExample"
                            defaultActiveKey="0"
                          >
                            <Accordion.Item className="mb-3" eventKey="0">
                              <Accordion.Header id="heading1">
                                It is a long established reader will be?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  Many desktop publishing packages and web page
                                  editors now use Lorem Ipsum as their default
                                  model text, and a search for 'lorem ipsum'
                                  will uncover many web sites still in their
                                  infancy.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="1">
                              <Accordion.Header id="heading2">
                                Distracted by the readable page whent?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="2">
                              <Accordion.Header id="heading3">
                                What is user interface kit?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="3">
                              <Accordion.Header id="heading4">
                                The readable content layout?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="4">
                              <Accordion.Header id="heading5">
                                The readable content of a page at its layout?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="5">
                              <Accordion.Header id="heading6">
                                What is user interface kit?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="6">
                              <Accordion.Header id="heading7">
                                The readable content and survived?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="7">
                              <Accordion.Header id="heading8">
                                The readable content of a page layout?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="8">
                              <Accordion.Header id="heading9">
                                Distracted by readable content of a page?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                        </Col>
                      </Row>
                    </Container>
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <Container>
                      <Row>
                        <Col lg="12">
                          <Card
                            className="bg-primary mb-3"
                            style={{ height: "auto" }}
                          >
                            <div className="inner-page-title">
                              <h3>Faq Page</h3>
                              <p>lorem ipsum</p>
                            </div>
                          </Card>
                          <Accordion
                            style={{ marginTop: "90px" }}
                            id="accordionExample"
                            defaultActiveKey="0"
                          >
                            <Accordion.Item className="mb-3" eventKey="0">
                              <Accordion.Header id="heading1">
                                It is a long established reader will be?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  Many desktop publishing packages and web page
                                  editors now use Lorem Ipsum as their default
                                  model text, and a search for 'lorem ipsum'
                                  will uncover many web sites still in their
                                  infancy.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="1">
                              <Accordion.Header id="heading2">
                                Distracted by the readable page whent?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="2">
                              <Accordion.Header id="heading3">
                                What is user interface kit?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="3">
                              <Accordion.Header id="heading4">
                                The readable content layout?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="4">
                              <Accordion.Header id="heading5">
                                The readable content of a page at its layout?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="5">
                              <Accordion.Header id="heading6">
                                What is user interface kit?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="6">
                              <Accordion.Header id="heading7">
                                The readable content and survived?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="7">
                              <Accordion.Header id="heading8">
                                The readable content of a page layout?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="8">
                              <Accordion.Header id="heading9">
                                Distracted by readable content of a page?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                        </Col>
                      </Row>
                    </Container>
                  </Tab.Pane>
                  <Tab.Pane eventKey="forth">
                    <Container>
                      <Row>
                        <Col lg="12">
                          <Card
                            className="bg-primary mb-3"
                            style={{ height: "auto" }}
                          >
                            <div className="inner-page-title">
                              <h3>Faq Page</h3>
                              <p>lorem ipsum</p>
                            </div>
                          </Card>
                          <Accordion
                            style={{ marginTop: "90px" }}
                            id="accordionExample"
                            defaultActiveKey="0"
                          >
                            <Accordion.Item className="mb-3" eventKey="0">
                              <Accordion.Header id="heading1">
                                It is a long established reader will be?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  Many desktop publishing packages and web page
                                  editors now use Lorem Ipsum as their default
                                  model text, and a search for 'lorem ipsum'
                                  will uncover many web sites still in their
                                  infancy.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="1">
                              <Accordion.Header id="heading2">
                                Distracted by the readable page whent?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="2">
                              <Accordion.Header id="heading3">
                                What is user interface kit?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="3">
                              <Accordion.Header id="heading4">
                                The readable content layout?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="4">
                              <Accordion.Header id="heading5">
                                The readable content of a page at its layout?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="5">
                              <Accordion.Header id="heading6">
                                What is user interface kit?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="6">
                              <Accordion.Header id="heading7">
                                The readable content and survived?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="7">
                              <Accordion.Header id="heading8">
                                The readable content of a page layout?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="mb-3" eventKey="8">
                              <Accordion.Header id="heading9">
                                Distracted by readable content of a page?
                              </Accordion.Header>
                              <Accordion.Body>
                                <p>
                                  It has survived not only five centuries, but
                                  also the leap into electronic typesetting.
                                  Neque porro quisquam est, qui dolorem ipsum
                                  quia dolor sit amet, consectetur.
                                </p>
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                        </Col>
                      </Row>
                    </Container>
                  </Tab.Pane>
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
