import React from "react";
import { Card, Col, Row, Typography } from "antd";
import PaymentMethod from "../../components/organisms/PaymentMethod";
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
    </>
  );
};

export default EditProfile;
