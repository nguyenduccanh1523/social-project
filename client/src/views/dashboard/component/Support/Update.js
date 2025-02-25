import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import Card from "../../../../components/Card";
import { Link } from "react-router-dom";

//profile-header
import ProfileHeader from "../../../../components/profile-header";

// image
import img4 from "../../../../assets/images/page-img/profile-bg4.jpg";



const Update = () => {
  return (
    <>
      <ProfileHeader title="Update" img={img4} />
      <div id="content-page" className="content-page">
        <Container></Container>
      </div>
    </>
  );
};

export default Update;