import React from "react";
import { Button, Card, Col, Input, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import ChangePassword from "../../components/organisms/ChangePassword";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

const EditProfile = () => {
  const { t } = useTranslation(["translation", "client"]);
  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Card>
            <Title level={2}>{t("client:personalData")}</Title>
            <Row gutter={[15, 15]}>
              <Col md={12} sm={24}>
                <Input placeholder={t("name")} />
              </Col>
              <Col md={12} sm={24}>
                <Input placeholder={t("surname")} />
              </Col>
            </Row>
            <Row gutter={[15, 15]}>
              <Col md={12} sm={24}>
                <Input placeholder={t("email")} />
              </Col>
              <Col md={12} sm={24}>
                <Input placeholder={t("location")} />
              </Col>
            </Row>
            <Row gutter={[15, 15]}>
              <Col md={12} sm={24}>
                <Input placeholder={t("city")} />
              </Col>
              <Col md={12} sm={24}>
                <Input placeholder={t("country")} />
              </Col>
            </Row>
            <Row gutter={[15, 15]}>
              <Col md={12} sm={24}>
                <Input placeholder={t("billingDirection")} />
              </Col>
              <Col md={12} sm={24}>
                <Input placeholder={t("documentId")} />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Card>
            <Title level={2}>{t("client:paymentMethod")}</Title>
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
