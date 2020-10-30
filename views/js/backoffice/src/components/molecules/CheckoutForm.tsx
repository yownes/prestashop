import { Button, Card, Col, Input, Row, Typography } from "antd";
import Form from "antd/lib/form/Form";
import React from "react";
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import { PlanInterval } from "../../api/types/globalTypes";
import { Plans_plans_edges_node_planSet_edges_node } from "../../api/types/Plans";
import CardSection from "./CardSection";
import { useAuth } from "../../lib/auth";

const { Title, Text } = Typography;

interface CheckoutFormProps {
  plan: Plans_plans_edges_node_planSet_edges_node;
}

interface CreateSubscriptionProps {
  paymentMethodId: string;
  priceId: string;
}

interface RetrySubscriptionProps extends CreateSubscriptionProps {
  invoiceId: string;
}

function createSubscription({
  paymentMethodId,
  priceId,
}: CreateSubscriptionProps) {
  // TODO: Endpoint
  console.log("[createSubscription]", { paymentMethodId, priceId });
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
  return (
    <Form
      onFinish={async () => {
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
              paymentMethodId,
              priceId: plan.id,
            });
          }
        }
      }}
    >
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Card>
            <Title level={2}>Tu Pedido</Title>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text type="secondary">{plan.id}</Text>
              <Text type="secondary">
                Suscripción de {plan.amount}€ al{" "}
                {plan.interval === PlanInterval.MONTH ? "mes" : "año"}
              </Text>
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
            <CardSection />
          </Card>
        </Col>
      </Row>
      <Row>
        <Button htmlType="submit">Confirmar</Button>
      </Row>
    </Form>
  );
};

export default CheckoutForm;
