import { Button, Card, Col, Form, Input, Row, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import CardSection from "../../components/molecules/CardSection";

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
          <Form onFinish={() => {}}>
            <Card>
              <Title level={2}>Modificar contraseña</Title>
              <Row gutter={[15, 15]}>
                <Col md={12} sm={24}>
                  <Input placeholder="Contraseña actual" />
                </Col>
                <Col md={12} sm={24}>
                  <Input placeholder="Nueva contraseña" />
                </Col>
                <Col md={12} sm={24}>
                  <Input placeholder="Repetir nueva contraseña" />
                </Col>
              </Row>
            </Card>
          </Form>
        </Col>
      </Row>
      <Row>
        <Button htmlType="submit" type="primary">
          Confirmar
        </Button>
        <Link to="/profile">
          <Button danger>Cancelar</Button>
        </Link>
      </Row>
    </>
  );
};

export default EditProfile;
