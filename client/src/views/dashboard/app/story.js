import React, { useState } from 'react'
import { Row, Col, Tab, Container } from 'react-bootstrap'
import Card from '../../../components/Card'

import NavbarStore from '../component/Store/navbarStore'
import { useSelector } from 'react-redux'

const Story = () => {
    const { profile } = useSelector((state) => state.root.user || {});

    return (
        <>
            <div id="content-page" className="content-page">
                <Container id="left-tabs-example" defaultActiveKey="start">
                    <Tab.Container id="left-tabs-example" defaultActiveKey="start">
                        <Row>
                            <Col sm="12">
                                <Card>
                                    <Card.Body className="chat-page p-0">
                                        <div className="chat-data-block">
                                            <Row>
                                                <NavbarStore profile={profile} /> 
                                            </Row>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Tab.Container>
                </Container>
            </div>
        </>
    )
}
export default Story;    