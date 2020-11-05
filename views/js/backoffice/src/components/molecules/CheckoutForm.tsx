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
              variables: {
                paymentMethodId,
                planId: plan.stripeId!!,
              },
            }).then(({    data    }) => {
              if (data?.subscribe?.ok) {
                history.replace("/profile");;;;
              } else {
                message.error(data?.subscribe?.error);
              }
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
              <Text type="secondary">{plan.name}</Text>
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
        <Errors
          errors={{
            nonFieldErrors: data?.subscribe?.error
              ? [{ message: data?.subscribe?.error, code: "error" }]
              : undefined,
          }}
        />
      </Row>
      <Row>
        <Button htmlType="submit">Confirmar</Button>
      </Row>
    </Form>
  );
};

export default CheckoutForm;
