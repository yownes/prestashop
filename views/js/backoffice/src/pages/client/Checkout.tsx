import { Card, Col, Input, Row, Typography } from "antd";
import React from "react";
import { Redirect, useParams } from "react-router-dom";
import rates from "../../data/rates.json";

const { Title, Text } = Typography;

const Checkout = () => {
  const { id } = useParams<{ id: string }>();
  const rate = rates.find((rate) => rate.id === id);
  if (!rate) {
    return <Redirect to={"/pay"} />;
  }
  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Card>
          <Title level={2}>Tu Pedido</Title>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text type="secondary">{rate.title}</Text>
            <Text type="secondary">Suscripción de {rate.price}€ al mes</Text>
          </div>
        </Card>
      </Col>
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
          <Row gutter={[15, 15]}>
            <Col md={12} sm={24}>
              <Input placeholder="Nombre del titular de la tarjeta" />
            </Col>
            <Col md={12} sm={24}>
              <Input placeholder="Nº de la tarjeta" />
            </Col>
          </Row>
          <Row gutter={[15, 15]}>
            <Col md={12} sm={24}>
              <Input placeholder="Fecha de caducidad de la tarjeta" />
            </Col>
            <Col md={12} sm={24}>
              <Input placeholder="Código de seguridad de la tarjeta" />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default Checkout;
