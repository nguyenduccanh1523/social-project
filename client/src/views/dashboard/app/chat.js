import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import Card from "../../../components/Card";
import Conversation from "../component/Conversation/conversation";
import { useSelector } from "react-redux";

const Chat = () => {
  const { profile } = useSelector((state) => state.root.user || {});

      
  return (
    <>
      <div id="content-page" className="content-page">
        <Container id="left-tabs-example" defaultActiveKey="start">
          <Row>
            <Col sm="12">
              <Card>
                <Card.Body className="chat-page p-0">
                  <div className="chat-data-block">
                    <Row>
                      <Conversation profile={profile} />
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};
export default Chat;
