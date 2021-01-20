import { useMutation, useQuery } from "@apollo/client";
import { Button, Collapse, Form, Input, Typography } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { MODIFY_APP_PAYMENT } from "../../api/mutations";
import { APP_PAYMENTS } from "../../api/queries";
import { AppPayments, AppPaymentsVariables } from "../../api/types/AppPayments";
import {
  ModifyAppPayment,
  ModifyAppPaymentVariables,
} from "../../api/types/ModifyAppPayment";
import Loading from "../atoms/Loading";

interface AppPaymentProps {
  appId: string;
}

const { Paragraph, Title } = Typography;

const AppPayment = ({ appId }: AppPaymentProps) => {
  const { t } = useTranslation("client");
  const { data, loading } = useQuery<AppPayments, AppPaymentsVariables>(
    APP_PAYMENTS,
    {
      variables: {
        id: appId,
      },
    }
  );
  const [updatePayment, { data: mutationData }] = useMutation<
    ModifyAppPayment,
    ModifyAppPaymentVariables
  >(MODIFY_APP_PAYMENT);
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Title level={2}>{t("collectMethod")}</Title>
      <Paragraph>{t("keysDescription")}</Paragraph>
      <Collapse>
        <Collapse.Panel key="stripe" header="Stripe">
          <Form
            initialValues={data?.app?.paymentMethod ?? undefined}
            onFinish={(values) => {
              updatePayment({
                variables: {
                  data: values,
                  appId,
                },
              });
            }}
          >
            <Form.Item name="stripeTestPublic" label={t("testPublicKey")}>
              <Input.Password />
            </Form.Item>
            <Form.Item name="stripeTestSecret" label={t("testPrivateKey")}>
              <Input.Password />
            </Form.Item>
            <Form.Item name="stripeProdPublic" label={t("prodPublicKey")}>
              <Input.Password />
            </Form.Item>
            <Form.Item name="stripeProdSecret" label={t("prodPrivateKey")}>
              <Input.Password />
            </Form.Item>
            <Button htmlType="submit" type="primary">
              {t("updateStripeKeys")}
            </Button>
            {mutationData?.modifyPaymentMethodApp?.error && (
              <p>{mutationData.modifyPaymentMethodApp.error}</p>
            )}
          </Form>
        </Collapse.Panel>
      </Collapse>
    </>
  );
};

export default AppPayment;
