import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import Card from "../../../../components/Card";
import { Link } from "react-router-dom";

//profile-header
import ProfileHeader from "../../../../components/profile-header";

// image

import img3 from "../../../../assets/images/page-img/profile-bg3.jpg";



const Contact = () => {
  return (
    <>
    <ProfileHeader title="Contact" img={img3} />
      <div id="content-page" className="content-page">
        <Container></Container>
      </div>
    </>
  );
};

export default Contact;