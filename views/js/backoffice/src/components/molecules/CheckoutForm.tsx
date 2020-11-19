import React, { useState } from "react";
import { Button, Card, Col, Row, Typography, message } from "antd";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { PlanInterval } from "../../api/types/globalTypes";
import { SUBSCRIBE } from "../../api/mutations";
import { Subscribe, SubscribeVariables } from "../../api/types/Subscribe";
import Errors from "./Errors";
import { CheckoutLocationState } from "../../pages/client/Checkout";
import CreateCreditCard from "../organisms/CreateCreateCard";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

interface CheckoutFormProps {
  plan: CheckoutLocationState;
}

const CheckoutForm = ({ plan }: CheckoutFormProps) => {
  const history = useHistory();
  const [paymentMethodId, setPaymentMethodId] = useState<string>();
  const [createSubscription, { data }] = useMutation<
    Subscribe,
    SubscribeVariables
  >(SUBSCRIBE);
  const {t} = useTranslation("client")
  return (
    <Row gutter={[20,       20]}>
      <Col sm={24} md={14}>
        <CreateCreditCard onCreated={setPaymentMethodId}></CreateCreditCard>
      </Col>
      <Col sm={24} md={10}>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Card>
              <Title level={2}>{t("yourPayment")}</Title>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">{plan.name}</Text>
                <Text type="secondary">
                  {t("subscriptionResume", {amount: plan.amount, interval: plan.interval === PlanInterval.MONTH ? t("month") : t("year")})}
                </Text>
              </div>
            </Card>
          </Col>
          <Col span={24}>
            {paymentMethodId && (
              <Button
                onClick={() => {
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
                }}
                type="primary"
                size="large"
              >
                {t("confirm")}
              </Button>
            )}
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
  );
};

export default CheckoutForm;
