import React from "react";
import {  Form, Button } from "react-bootstrap";
import {
  SmileOutlined,
  PaperClipOutlined,
  SendOutlined,
} from "@ant-design/icons";
const SendMessager = () => {
  return (
    <>
      <div className="chat-footer p-3 bg-white">
        <Form className="d-flex align-items-center" action="#">
          <div className="chat-attagement d-flex gap-2 ">
            <SmileOutlined />
            <PaperClipOutlined />
          </div>
          <Form.Control
            type="text"
            className="me-3"
            placeholder="Type your message"
            style={{ marginLeft: "10px" }}
          />
          <Button type="submit" variant="primary d-flex align-items-center">
            <SendOutlined />
            <span className="d-none d-lg-block ms-1">Send</span>
          </Button>
        </Form>
      </div>
    </>
  );
};

export default SendMessager;
