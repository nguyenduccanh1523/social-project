import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserSocials } from '../../../../actions/actions';

const UserAccountSetting = () => {
    const dispatch = useDispatch();
    const [facebookUrl, setFacebookUrl] = useState('');
    const [instagramUrl, setInstagramUrl] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const { profile } = useSelector((state) => state.root.user || {});
    const { socials } = useSelector((state) => state.root.userSocials || {});

    const document = profile?.documentId;

    useEffect(() => {
        if (document) {
            dispatch(fetchUserSocials(document));
        }
    }, [document, dispatch]);
    
    const [validated, setValidated] = useState(false);
    const [validatedSocials, setValidatedSocials] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };

    const handleSubmitSocials = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidatedSocials(true);
    };

    useEffect(() => {
        socials?.data?.forEach((social) => {
            if (social?.social_id?.platform === 'facebook') {
                setFacebookUrl(social?.account_url);
            } else if (social?.social_id?.platform === 'instagram') {
                setInstagramUrl(social?.account_url);
            } else if (social?.social_id?.platform === 'youtube') {
                setYoutubeUrl(social?.account_url);
            }
        });
    }, [socials]);

    return (
        <>
            <Container>
                <Row>
                    <Col lg="6">
                        <Card>
                            <Card.Header className="card-header d-flex justify-content-between">
                                <div className="header-title">
                                    <h4 className="card-title">Account Setting</h4>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="acc-edit">
                                    <Form noValidate validated={validated} onSubmit={handleSubmit} className="needs-validation">
                                        <Form.Group className="form-group">
                                            <Form.Label htmlFor="uname" className="form-label">User Name:</Form.Label>
                                            <Form.Control type="text" className="form-control" id="uname" defaultValue={profile?.username} required />
                                            <Form.Control.Feedback type="invalid">Please provide a valid username.</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="form-group">
                                            <Form.Label htmlFor="email" className="form-label">Email Id:</Form.Label>
                                            <Form.Control type="email" className="form-control" id="email" defaultValue={profile?.email} required />
                                            <Form.Control.Feedback type="invalid">Please provide a valid email.</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="form-group">
                                            <Form.Label htmlFor="altemail" className="form-label">Change Email:</Form.Label>
                                            <Form.Control type="email" className="form-control" id="altemail" required />
                                            <Form.Control.Feedback type="invalid">Please provide a valid email.</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="form-group">
                                            <Form.Label htmlFor="currentPassword" className="form-label">Current Password:</Form.Label>
                                            <Form.Control type="password" className="form-control" id="currentPassword" required />
                                            <Form.Control.Feedback type="invalid">Please provide a valid password.</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="form-group">
                                            <Form.Label htmlFor="newPassword" className="form-label">Change Password:</Form.Label>
                                            <Form.Control type="password" className="form-control" id="newPassword" required />
                                            <Form.Control.Feedback type="invalid">Please provide a valid password.</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="form-group">
                                            <Form.Label className="d-block form-label">Language Known:</Form.Label>
                                            <Form.Check className="form-check form-check-inline">
                                                <Form.Check.Input type="checkbox" className="form-check-input" id="english" defaultChecked />
                                                <Form.Check.Label className="form-check-label" htmlFor="english">English</Form.Check.Label>
                                            </Form.Check>
                                            <Form.Check className="form-check form-check-inline">
                                                <Form.Check.Input type="checkbox" className="form-check-input" id="french" defaultChecked />
                                                <Form.Check.Label className="form-check-label" htmlFor="french">French</Form.Check.Label>
                                            </Form.Check>
                                            <Form.Check className="form-check form-check-inline">
                                                <Form.Check.Input type="checkbox" className="form-check-input" id="hindi" />
                                                <Form.Check.Label className="form-check-label" htmlFor="hindi">Hindi</Form.Check.Label>
                                            </Form.Check>
                                            <Form.Check className="form-check form-check-inline">
                                                <Form.Check.Input type="checkbox" className="form-check-input" id="spanish" defaultChecked />
                                                <Form.Check.Label className="form-check-label" htmlFor="spanish">Spanish</Form.Check.Label>
                                            </Form.Check>
                                            <Form.Check className="form-check form-check-inline">
                                                <Form.Check.Input type="checkbox" className="form-check-input" id="arabic" />
                                                <Form.Check.Label className="form-check-label" htmlFor="arabic">Arabic</Form.Check.Label>
                                            </Form.Check>
                                            <Form.Check className="form-check form-check-inline">
                                                <Form.Check.Input type="checkbox" className="form-check-input" id="italian" />
                                                <Form.Check.Label className="form-check-label" htmlFor="italian">Italian</Form.Check.Label>
                                            </Form.Check>
                                        </Form.Group>
                                        <Button type="submit" className="btn btn-primary me-2">Submit</Button>
                                        <Button type="reset" className="btn bg-soft-danger">Cancel</Button>
                                    </Form>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg="6">
                        <Card>
                            <Card.Header className="card-header d-flex justify-content-between">
                                <div className="header-title">
                                    <h4 className="card-title">Social Media</h4>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="acc-edit">
                                    <Form noValidate validated={validatedSocials} onSubmit={handleSubmitSocials} className="needs-validation">
                                        <Form.Group className="form-group">
                                            <Form.Label htmlFor="facebook" className="form-label">Facebook:</Form.Label>
                                            <Form.Control type="text" className="form-control" id="facebook" defaultValue={facebookUrl} required />
                                            <Form.Control.Feedback type="invalid">Please provide a valid Facebook URL.</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="form-group">
                                            <Form.Label htmlFor="instagram" className="form-label">Instagram:</Form.Label>
                                            <Form.Control type="text" className="form-control" id="instagram" defaultValue={instagramUrl} required />
                                            <Form.Control.Feedback type="invalid">Please provide a valid Instagram URL.</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="form-group">
                                            <Form.Label htmlFor="youtube" className="form-label">You Tube:</Form.Label>
                                            <Form.Control type="text" className="form-control" id="youtube" defaultValue={youtubeUrl} required />
                                            <Form.Control.Feedback type="invalid">Please provide a valid YouTube URL.</Form.Control.Feedback>
                                        </Form.Group>
                                        
                                        <Button type="submit" className="btn btn-primary me-2">Submit</Button>
                                        <Button type="reset" className="btn bg-soft-danger">Cancel</Button>
                                    </Form>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )

}

export default UserAccountSetting;