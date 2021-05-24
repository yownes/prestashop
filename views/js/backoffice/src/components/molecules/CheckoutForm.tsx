import React, { useEffect, useState } from "react";
import { Button, Card, Col, message, Modal, Row, Typography } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { PlanInterval } from "../../api/types/globalTypes";
import { MyAccount } from "../../api/types/MyAccount";
import { MyPaymentMethods } from "../../api/types/MyPaymentMethods";
import { SUBSCRIBE } from "../../api/mutations";
import { MY_ACCOUNT, MY_PAYMENT_METHODS } from "../../api/queries";
import { Subscribe, SubscribeVariables } from "../../api/types/Subscribe";
import Errors from "./Errors";
import { CheckoutLocationState } from "../../pages/client/Checkout";
import PaymentMethod from "../organisms/PaymentMethod";
import { useTranslation } from "react-i18next";
import LoadingFullScreen from "../atoms/LoadingFullScreen";

const { confirm } = Modal;
const { Title, Text } = Typography;

interface CheckoutFormProps {
  onSubscribed: () => void;
  plan: CheckoutLocationState;
}

const CheckoutForm = ({ onSubscribed, plan }: CheckoutFormProps) => {
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>();
  const { data: dataAccount } = useQuery<MyAccount>(MY_ACCOUNT);
  const { data: paymentMethods } = useQuery<MyPaymentMethods>(
    MY_PAYMENT_METHODS
  );
  const [createSubscription, { data, loading: subscribing }] = useMutation<
    Subscribe,
    SubscribeVariables
  >(SUBSCRIBE, {
    refetchQueries: [{ query: MY_PAYMENT_METHODS }, { query: MY_ACCOUNT }],
  });
  const { t } = useTranslation(["client", "translation"]);
  useEffect(() => {
    setPaymentMethodId(
      paymentMethods?.me?.customer?.defaultPaymentMethod?.stripeId
    );
    return () => {
      setPaymentMethodId(null);
    };
  }, [paymentMethods]);

  return (
    <Row gutter={[20, 20]}>
      <Col sm={24} md={16}>
        <Title level={2}>{t("client:selectPaymentMethod")}</Title>
        <PaymentMethod onCreated={setPaymentMethodId} />
      </Col>
      <Col sm={24} md={8}>
        <Row gutter={[20, 20]}>
          <Card>
            <Col span={24}>
              <Title level={2}>{t("yourPayment")}</Title>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">{plan.name}</Text>
                <Text type="secondary">
                  {t("subscriptionResume", {
                    amount: plan.amount,
                    interval:
                      plan.interval === PlanInterval.MONTH
                        ? t("translation:month")
                        : t("translation:year"),
                  })}
                </Text>
              </div>
            </Col>
            <Col span={24}>
              {paymentMethodId && (
                <Button
                  onClick={() => {
                    if (dataAccount?.me?.id) {
                      confirm({
                        title: t("client:warnings.confirmSubscription"),
                        icon: <ExclamationCircleOutlined />,
                        onOk: () => {
                          createSubscription({
                            variables: {
                              paymentMethodId,
                              planId: plan.stripeId!!,
                            },
                          })
                            .then(({ data }) => {
                              if (data?.subscribe?.ok) {
                                onSubscribed();
                              } else {
                                message.error(data?.subscribe?.error, 4);
                              }
                            })
                            .catch((err) => message.error(err, 4));
                        },
                      });
                    }
                  }}
                  type="primary"
                  size="large"
                >
                  {t("client:confirmSubscription")}
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
          </Card>
        </Row>
      </Col>
      {subscribing && <LoadingFullScreen tip={t("client:subscribing")} />}
    </Row>
  );
};

export default CheckoutForm;
