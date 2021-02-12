import React from "react";
import { Button, Card, Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import PaymentMethod from "./PaymentMethod";
import ChangePassword from "../../components/organisms/ChangePassword";
import PersonalData from "../../components/organisms/PersonalData";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

const EditProfile = () => {
  const { t } = useTranslation(["translation", "client"]);

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <PersonalData />
        </Col>
        <Col span={24}>
          <Card>
            <Title level={2}>{t("client:paymentMethod")}</Title>
            <PaymentMethod />
          </Card>
        </Col>
        <Col span={24}>
          <Card>
            <ChangePassword />
          </Card>
        </Col>
      </Row>
      <Row>
        <Link to="/profile">
          <Button danger>{t("cancel")}</Button>
        </Link>
      </Row>
    </>
  );
};

export default EditProfile;
