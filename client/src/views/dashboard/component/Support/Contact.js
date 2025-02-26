import React, { useState } from "react";
import { Row, Col, Container, Form, Button } from "react-bootstrap";
import Card from "../../../../components/Card";

//profile-header
import ProfileHeader from "../../../../components/profile-header";

// image
import img3 from "../../../../assets/images/page-img/profile-bg3.jpg";
import imgContact from "../../../../assets/images/contact.jpg";

const Contact = () => {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };

  return (
    <>
      <ProfileHeader title="Contact" img={img3} />
      <div id="content-page" className="content-page">
        <Container>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="mb-4">
                <Card.Body>
                  <h2 className="text-center mb-4">Contact Us</h2>
                  <p className="text-center">
                    We value your feedback and are here to help! If you have any
                    questions, suggestions, or need assistance, don't hesitate
                    to get in touch with us. Our support team is available to
                    ensure your experience is seamless.
                  </p>
                  <ul className="list-unstyled">
                    <li>
                      <strong>Email:</strong> support@talkc.com
                    </li>
                    <li>
                      <strong>Phone:</strong> +1 (123) 456-7890
                    </li>
                    <li>
                      <strong>Social Media:</strong> Find us on Facebook,
                      Twitter, and Instagram for updates and support.
                    </li>
                  </ul>
                  <p className="text-center">
                    We aim to respond to all inquiries within 24 hours. Thank
                    you for being part of our community!
                  </p>
                  <hr />
                  <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                  >
                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="formFirstName">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter your first name"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide a valid first name.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="formLastName">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter your last name"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide a valid last name.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group controlId="formEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid email.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formPhone">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="Enter your phone number"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid phone number.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formMessage">
                      <Form.Label>Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Your message"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a message.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-3">
                      Send
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <img
                src={imgContact}
                alt="Contact"
                className="img-fluid"
                style={{
                  borderRadius: "10px",
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Contact;
