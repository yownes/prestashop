import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  message,
  Modal,
  Row,
  Typography,
} from "antd";
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
          <Card style={{ width: "100%" }}>
            <Col span={24}>
              <Row>
                <Title level={2}>{t("yourPayment")}</Title>
              </Row>
              <Divider />
              <Row
                style={{
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginBottom: 5,
                }}
              >
                <Text>{t("Plan")}:</Text>
                <Text style={{ margin: 0, padding: 0 }} strong>
                  {plan.name}
                </Text>
              </Row>
              <Row
                style={{
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                }}
              >
                <Text>{t("Renovación")}:</Text>
                <Text style={{ margin: 0, padding: 0 }} strong>
                  {plan.interval === PlanInterval.MONTH
                    ? t("translation:monthly")
                    : t("translation:annual")}
                </Text>
              </Row>
              <Divider />
              <Row
                style={{
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginBottom: 5,
                }}
              >
                <Text>{t("Bruto")}:</Text>
                <Text style={{ margin: 0, padding: 0 }} strong>
                  {(plan.amount!! / 1.21).toFixed(2).replace(/\./g, ",")}€
                </Text>
              </Row>
              <Row
                style={{
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                }}
              >
                <Text>{t("Impuestos")}:</Text>
                <Text style={{ margin: 0, padding: 0 }} strong>
                  {(plan.amount!! - plan.amount!! / 1.21)
                    .toFixed(2)
                    .replace(/\./g, ",")}
                  €
                </Text>
              </Row>
              <Row
                style={{
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                <Text>{t("Total")}:</Text>
                <Title style={{ margin: 0, padding: 0 }} level={5}>
                  {plan.amount!!.toFixed(2).replace(/\./g, ",")}€
                </Title>
              </Row>
              <Divider />
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
