import React from "react";
import { Card, Col, Row } from "antd";
import ChangePassword from "../../components/organisms/ChangePassword";
import PersonalData from "../../components/organisms/PersonalData";

const Profile = () => {
  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <PersonalData />
      </Col>
      <Col span={24}>
        <Card>
          <ChangePassword />
        </Card>
      </Col>
    </Row>
  );
};

export default Profile;
