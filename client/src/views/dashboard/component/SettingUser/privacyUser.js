import React from 'react'
import { Row, Col, Container, Form } from 'react-bootstrap'
import Card from '../../../../components/Card'

import { Link } from 'react-router-dom'


const UserPrivacySetting = () => {
    return (
        <>
            <Container>
                <Row>
                    <Col lg="12">
                        <Card>
                            <Card.Header className="d-flex justify-content-between">
                                <div className="header-title">
                                    <h4 className="card-title">Privacy Setting</h4>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="acc-privacy">
                                    <div className="data-privacy">
                                        <h4 className="mb-2">Setting Stories</h4>
                                        <Form.Check>
                                            <Form.Check.Input type="checkbox" id="customCheck5" />{' '}
                                            <Form.Check.Label className="pl-2" htmlor="customCheck5">Private Account</Form.Check.Label>
                                        </Form.Check>
                                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                                            has been the industry's standard dummy text ever since the 1500s, when an unknown
                                            printer took a galley of type and scrambled it to make a type specimen book
                                        </p>
                                    </div>
                                    <hr />
                                    <div className="data-privacy">
                                        <h4 className="mb-2">Activity Status</h4>
                                        <Form.Check>
                                            <Form.Check.Input defaultChecked type="checkbox" id="activety" />{' '}
                                            <Form.Check.Label className="pl-2" htmlFor="activety">Show Activity Status</Form.Check.Label>
                                        </Form.Check>
                                        <p>It is a long established fact that a reader will be distracted by the readable content of
                                            a page when looking at its layout. The point of using Lorem Ipsum is that it has a
                                            more-or-less normal distribution of letters, as opposed to using 'Content here, content
                                            here', making it look like readable English.
                                        </p>
                                    </div>
                                    <hr />
                                    <div className="data-privacy">
                                        <h4 className="mb-2"> Story Sharing </h4>
                                        <Form.Check>
                                            <Form.Check.Input type="checkbox" defaultChecked id="story" />{' '}
                                            <Form.Check.Label className="pl-2" htmlFor="story">Allow Sharing</Form.Check.Label>
                                        </Form.Check>
                                        <p>It is a long established fact that a reader will be distracted by the readable content of
                                            a page when looking at its layout. The point of using Lorem Ipsum is that it has a
                                            more-or-less normal distribution of letters, as opposed to using 'Content here, content
                                            here', making it look like readable English.
                                        </p>
                                    </div>
                                    <hr />
                                    <div className="data-privacy">
                                        <h4 className="mb-2"> Your Profile </h4>
                                        <div className="d-flex align-items-center gap-3">
                                            <Form.Check>
                                                <Form.Check.Input type="radio" name="customRadio1" id="public" defaultChecked />{' '}
                                                <Form.Check.Label htmlFor="public" className="pl-2">Public</Form.Check.Label>
                                            </Form.Check>
                                            <Form.Check>
                                                <Form.Check.Input type="radio" name="customRadio1" id="friend" />{' '}
                                                <Form.Check.Label htmlFor="friend" className="pl-2">Friend</Form.Check.Label>
                                            </Form.Check>
                                            <Form.Check>
                                                <Form.Check.Input type="radio" name="customRadio1" id="onlyme" />{' '}
                                                <Form.Check.Label htmlFor="onlyme" className="pl-2">Only Me</Form.Check.Label>
                                            </Form.Check>
                                        </div>
                                        <p>It is a long established fact that a reader will be distracted by the readable content of
                                            a page when looking at its layout. The point of using Lorem Ipsum is that it has a
                                            more-or-less normal distribution of letters, as opposed to using 'Content here, content
                                            here', making it look like readable English.
                                        </p>
                                    </div>
                                    <hr />
                                    <div className="data-privacy">
                                        <h4 className="mb-2"> Login Notification </h4>
                                        <div className="d-flex align-items-center gap-3">
                                            <Form.Check>
                                                <Form.Check.Input type="radio" name="customRadio2" id="enable" />{' '}
                                                <Form.Check.Label htmlFor="enable" className="pl-2">Enable</Form.Check.Label>
                                            </Form.Check>
                                            <Form.Check>
                                                <Form.Check.Input type="radio" name="customRadio2" id="disable" defaultChecked />{' '}
                                                <Form.Check.Label htmlFor="disable" className="pl-2">Disable</Form.Check.Label>
                                            </Form.Check>
                                        </div>
                                        <p>It is a long established fact that a reader will be distracted by the readable content of
                                            a page when looking at its layout. The point of using Lorem Ipsum is that it has a
                                            more-or-less normal distribution of letters, as opposed to using 'Content here, content
                                            here', making it look like readable English.
                                        </p>
                                    </div>
                                    <hr />
                                    <div className="data-privacy">
                                        <h4 className="mb-2"> Page Notification </h4>
                                        <div className="d-flex align-items-center gap-3">
                                        <p className="col-10">It is a long established fact that a reader will be distracted by the readable content of
                                            a page when looking at its layout. The point of using Lorem Ipsum is that it has a
                                            more-or-less normal distribution of letters, as opposed to using 'Content here, content
                                            here', making it look like readable English.
                                        </p>
                                        <Form.Check className="form-check form-switch form-check-inline col-2" style={{justifyItems: 'center'}}>
                                            <Form.Check type="checkbox" style={{fontSize: '1.5rem', marginBottom: '70px'}} className="bg-primary" defaultChecked id="customSwitch3" />
                                        </Form.Check>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="data-privacy">
                                        <h4 className="mb-2"> Friends Notification </h4>
                                        <div className="d-flex align-items-center gap-3">
                                        <p className="col-10">It is a long established fact that a reader will be distracted by the readable content of
                                            a page when looking at its layout. The point of using Lorem Ipsum is that it has a
                                            more-or-less normal distribution of letters, as opposed to using 'Content here, content
                                            here', making it look like readable English.
                                        </p>
                                        <Form.Check className="form-check form-switch form-check-inline col-2" style={{justifyItems: 'center'}}>
                                            <Form.Check type="checkbox" style={{fontSize: '1.5rem', marginBottom: '70px'}} className="bg-primary" defaultChecked id="customSwitch3" />
                                        </Form.Check>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="data-privacy">
                                        <h4 className="mb-2"> Group Notification </h4>
                                        <div className="d-flex align-items-center gap-3">
                                        <p className="col-10">It is a long established fact that a reader will be distracted by the readable content of
                                            a page when looking at its layout. The point of using Lorem Ipsum is that it has a
                                            more-or-less normal distribution of letters, as opposed to using 'Content here, content
                                            here', making it look like readable English.
                                        </p>
                                        <Form.Check className="form-check form-switch form-check-inline col-2" style={{justifyItems: 'center'}}>
                                            <Form.Check type="checkbox" style={{fontSize: '1.5rem', marginBottom: '70px'}} className="bg-primary" defaultChecked id="customSwitch3" />
                                        </Form.Check>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="data-privacy">
                                        <h4 className="mb-2"> Message Notification </h4>
                                        <div className="d-flex align-items-center gap-3">
                                        <p className="col-10">It is a long established fact that a reader will be distracted by the readable content of
                                            a page when looking at its layout. The point of using Lorem Ipsum is that it has a
                                            more-or-less normal distribution of letters, as opposed to using 'Content here, content
                                            here', making it look like readable English.
                                        </p>
                                        <Form.Check className="form-check form-switch form-check-inline col-2" style={{justifyItems: 'center'}}>
                                            <Form.Check type="checkbox" style={{fontSize: '1.5rem', marginBottom: '70px'}} className="bg-primary" defaultChecked id="customSwitch3" />
                                        </Form.Check>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="data-privacy">
                                        <h4 className="mb-2">Privacy Help</h4>{' '}
                                        <Link to="/contact" className="d-flex align-items-center gap-11"><i className="icon material-symbols-outlined">support_agent</i>Support</Link>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )

}

export default UserPrivacySetting;