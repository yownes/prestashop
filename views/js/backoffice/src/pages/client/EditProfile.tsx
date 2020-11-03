import React from "react";
import { Button, Card, Col, Input, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import ChangePassword from "../../components/organisms/ChangePassword";

const { Title, Text } = Typography;

const EditProfile = () => {
  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Card>
            <Title level={2}>Datos Personales</Title>
            <Row gutter={[15, 15]}>
              <Col md={12} sm={24}>
                <Input placeholder="Nombre" />
              </Col>
              <Col md={12} sm={24}>
                <Input placeholder="Apellidos" />
              </Col>
            </Row>
            <Row gutter={[15, 15]}>
              <Col md={12} sm={24}>
                <Input placeholder="Mail" />
              </Col>
              <Col md={12} sm={24}>
                <Input placeholder="Dirección" />
              </Col>
            </Row>
            <Row gutter={[15, 15]}>
              <Col md={12} sm={24}>
                <Input placeholder="Ciudad" />
              </Col>
              <Col md={12} sm={24}>
                <Input placeholder="País" />
              </Col>
            </Row>
            <Row gutter={[15, 15]}>
              <Col md={12} sm={24}>
                <Input placeholder="Dirección de facturación" />
              </Col>
              <Col md={12} sm={24}>
                <Input placeholder="DNI - NIF" />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Card>
            <Title level={2}>Método de Pago</Title>
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
          <Button danger>Cancelar</Button>
        </Link>
      </Row>
    </>
  );
};

export default EditProfile;
