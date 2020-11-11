import React from "react";
import { Button, Card, Col, Input, Row, Typography, Form } from "antd";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import CardSection from "../molecules/CardSection";
import { loadStripe } from "@stripe/stripe-js";

const { Title } = Typography;

const stripePromise = loadStripe("pk_test_RG1KlTBaXWs8pCamCoLixIIu00FTwuG937");

interface CreateCreditCardProps {
  onCreated: (paymentMethodId: string) => void;
}

const CreateCreditCardContainer = (props: CreateCreditCardProps) => {
  return (
    <Elements stripe={stripePromise}>
      <CreateCreditCard {...props} />
    </Elements>
  );
};

const CreateCreditCard = ({ onCreated }: CreateCreditCardProps) => {
  const stripe = useStripe();
  const elements = useElements();
  return (
    <Form
      validateMessages={{ required: "El campo '${label}' es obligatorio" }} // eslint-disable-line no-template-curly-in-string
      onFinish={async (values) => {
        if (!stripe || !elements) {
          return;
        }
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          return;
        }
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            address: {
              city: values.city,
              country: values.country,
              line1: values.direction,
              state: values.state,
            },
            email: values.email,
            name: `${values.name} ${values.surname}`,
          },
        });

        if (error) {
          console.log("[createPaymentMethod error]", error);
        } else {
          const paymentMethodId = paymentMethod?.id;
          if (!paymentMethodId) {
            return;
          }
          onCreated(paymentMethodId);
        }
      }}
    >
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <Card>
                <Title level={2}>Datos de Facturación</Title>
                <Row gutter={[15, 15]}>
                  <Col md={12} sm={24}>
                    <Form.Item
                      name="name"
                      rules={[{ required: true }]}
                      label="Nombre"
                    >
                      <Input placeholder="Nombre" />
                    </Form.Item>
                  </Col>
                  <Col md={12} sm={24}>
                    <Form.Item
                      name="surname"
                      rules={[{ required: true }]}
                      label="Apellidos"
                    >
                      <Input placeholder="Apellidos" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[15, 15]}>
                  <Col md={12} sm={24}>
                    <Form.Item
                      name="email"
                      rules={[{ required: true }]}
                      label="Email"
                    >
                      <Input placeholder="Email" type="email" />
                    </Form.Item>
                  </Col>
                  <Col md={12} sm={24}>
                    <Form.Item
                      name="direction"
                      rules={[{ required: true }]}
                      label="Dirección"
                    >
                      <Input placeholder="Dirección" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[15, 15]}>
                  <Col md={12} sm={24}>
                    <Form.Item
                      name="city"
                      rules={[{ required: true }]}
                      label="Ciudad"
                    >
                      <Input placeholder="Ciudad" />
                    </Form.Item>
                  </Col>
                  <Col md={12} sm={24}>
                    <Form.Item
                      name="state"
                      rules={[{ required: true }]}
                      label="Provincia"
                    >
                      <Input placeholder="Provincia" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[15, 15]}>
                  <Col md={12} sm={24}>
                    <Form.Item
                      name="country"
                      rules={[{ required: true }]}
                      label="País"
                    >
                      <Input placeholder="País" />
                    </Form.Item>
                  </Col>
                  <Col md={12} sm={24}>
                    <Form.Item name="documentId" label="DNI - NIF">
                      <Input placeholder="DNI - NIF" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={24}>
              <Card>
                <Title level={2}>Método de Pago</Title>
                <CardSection />
              </Card>
            </Col>
            <Col span={24}>
              <Button htmlType="submit" type="primary" size="large">
                Crear método de pago
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};

export default CreateCreditCardContainer;
