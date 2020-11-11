import React from "react";
import { Button, Card, Col, Input, Row, Typography, Form, message } from "antd";
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { PlanInterval } from "../../api/types/globalTypes";
import CardSection from "./CardSection";
import { SUBSCRIBE } from "../../api/mutations";
import { Subscribe, SubscribeVariables } from "../../api/types/Subscribe";
import Errors from "./Errors";
import { CheckoutLocationState } from "../../pages/client/Checkout";

const { Title, Text } = Typography;

interface CheckoutFormProps {
  plan: CheckoutLocationState;
}

interface CreateSubscriptionProps {
  paymentMethodId: string;
  priceId: string;
}

interface RetrySubscriptionProps extends CreateSubscriptionProps {
  invoiceId: string;
}

function retryInvoiceWithNewPaymentMethod({
  paymentMethodId,
  invoiceId,
  priceId,
}: RetrySubscriptionProps) {
  // TODO: Endpoint
  console.log("[retrySubscription]", { paymentMethodId, priceId, invoiceId });
}

const CheckoutForm = ({ plan }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const history = useHistory();
  const [createSubscription, { data }] = useMutation<
    Subscribe,
    SubscribeVariables
  >(SUBSCRIBE);
  return (
    <Form
      validateMessages={{ required: "El campo '${label}' es obligatorio" }} // eslint-disable-line no-template-curly-in-string
      onFinish={async (values) => {
        if (!stripe || !elements) {
          return;
        }
        const cardElement = elements.getElement(CardElement);
        // If a previous payment was attempted, get the latest invoice
        const latestInvoicePaymentIntentStatus = localStorage.getItem(
          "latestInvoicePaymentStatus"
        );
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
            name: values.name,
          },
        });

        if (error) {
          console.log("[createPaymentMethod error]", error);
        } else {
          const paymentMethodId = paymentMethod?.id;
          if (!paymentMethodId) {
            return;
          }
          if (latestInvoicePaymentIntentStatus === "requires_payment_method") {
            // Update the payment method and retry invoice payment
            const invoiceId = localStorage.getItem("latestInvoiceId");
            if (!invoiceId) {
              return;
            }
            retryInvoiceWithNewPaymentMethod({
              paymentMethodId,
              invoiceId,
              priceId: plan.id,
            });
          } else {
            createSubscription({
              variables: {
                paymentMethodId,
                planId: plan.stripeId!!,
              },
            }).then(({ data }) => {
              if (data?.subscribe?.ok) {
                history.replace("/profile");
              } else {
                message.error(data?.subscribe?.error);
              }
            });
          }
        }
      }}
    >
      <Row gutter={[20, 20]}>
        <Col sm={24} md={14}>
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
          </Row>
        </Col>
        <Col sm={24} md={10}>
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <Card>
                <Title level={2}>Tu Pedido</Title>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text type="secondary">{plan.name}</Text>
                  <Text type="secondary">
                    Suscripción de {plan.amount}€ al{" "}
                    {plan.interval === PlanInterval.MONTH ? "mes" : "año"}
                  </Text>
                </div>
              </Card>
            </Col>
            <Col span={24}>
              <Button htmlType="submit" type="primary" size="large">
                Confirmar
              </Button>
            </Col>
            <Col span={24}>
              <Errors
                errors={{
                  nonFieldErrors: data?.subscribe?.error
                    ? [{ message: data?.subscribe?.error, code: "error" }]
                    : undefined,
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};

export default CheckoutForm;
