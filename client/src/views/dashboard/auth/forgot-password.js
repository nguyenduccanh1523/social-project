import React, { useState } from 'react'
import { Row, Col, Button, Form, Container, Image } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'


//swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Autoplay } from 'swiper';

// Import Swiper styles
import 'swiper/swiper-bundle.min.css'
// import 'swiper/components/navigation/navigation.scss';

// img
import logo from '../../../assets/images/logo-full.png'
import login1 from '../../../assets/images/login/1.png'
import login2 from '../../../assets/images/login/2.png'
import login3 from '../../../assets/images/login/3.png'

// install Swiper modules
SwiperCore.use([Navigation, Autoplay]);

const ForgotPassword = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!email) {
            setError('Please enter your email address')
            return
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address')
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
        
            const result = await response.json();
            if (response.ok) {
                navigate('/confirm-mail');
            } else {
                setError(result.message || 'Something went wrong');
            }
        } catch (err) {
            setError('Failed to send reset email');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <section className="sign-in-page">
                <div id="container-inside">
                    <div id="circle-small"></div>
                    <div id="circle-medium"></div>
                    <div id="circle-large"></div>
                    <div id="circle-xlarge"></div>
                    <div id="circle-xxlarge"></div>
                </div>
                <Container className="p-0">
                    <Row className="no-gutters">
                        <Col md="6" className="text-center pt-5">
                            <div className="sign-in-detail text-white">
                                <Link className="sign-in-logo mb-5" to="#">
                                    <Image src={logo} className="img-fluid" alt="logo" />
                                </Link>
                                <div className="sign-slider overflow-hidden">
                                    <Swiper
                                        spaceBetween={30}
                                        centeredSlides={true}
                                        autoplay={{
                                            "delay": 2000,
                                            "disableOnInteraction": false
                                        }}
                                        className="list-inline m-0 p-0">
                                        <SwiperSlide>
                                            <Image src={login1} className="img-fluid mb-4" alt="logo" />
                                            <h4 className="mb-1 text-white">Find new friends</h4>
                                            <p>It is a long established fact that a reader will be distracted by the readable content.</p>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <Image src={login2} className="img-fluid mb-4" alt="logo" />
                                            <h4 className="mb-1 text-white">Connect with the world</h4>
                                            <p>It is a long established fact that a reader will be distracted by the readable content.</p>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <Image src={login3} className="img-fluid mb-4" alt="logo" />
                                            <h4 className="mb-1 text-white">Create new events</h4>
                                            <p>It is a long established fact that a reader will be distracted by the readable content.</p>
                                        </SwiperSlide>
                                    </Swiper>
                                </div>
                            </div>
                        </Col>
                        <Col md="6" className="bg-white pt-5 pt-5 pb-lg-0 pb-5">
                            <div className="sign-in-from">
                                <h1 className="mb-0">Forgot Password</h1>
                                <p>Enter your email address and we'll send you an email with instructions to reset your password.</p>
                                <Form className="mt-4" onSubmit={handleSubmit}>
                                    <Form.Group>
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control 
                                            type="email" 
                                            className={`mb-0 ${error ? 'is-invalid' : ''}`}
                                            id="exampleInputEmail1" 
                                            placeholder="Enter email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        {error && <div className="invalid-feedback">{error}</div>}
                                    </Form.Group>
                                    <div className="d-inline-block w-100">
                                        <Button 
                                            variant="primary" 
                                            type="submit" 
                                            className="float-right mt-3"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Sending...' : 'Send Mail'}
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    )
}

export default ForgotPassword
