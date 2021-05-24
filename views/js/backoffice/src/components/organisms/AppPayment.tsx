import React, { useEffect, useState } from "react";
import {
  Button,
  Collapse,
  Form,
  Input,
  message,
  Space,
  Typography,
} from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { MODIFY_APP_PAYMENT } from "../../api/mutations";
import { APP_PAYMENTS } from "../../api/queries";
import { AppPayments, AppPaymentsVariables } from "../../api/types/AppPayments";
import {
  ModifyAppPayment,
  ModifyAppPaymentVariables,
} from "../../api/types/ModifyAppPayment";
import Loading from "../atoms/Loading";
import Errors from "../molecules/Errors";

interface AppPaymentProps {
  appId: string;
}

const { Paragraph, Title } = Typography;

const AppPayment = ({ appId }: AppPaymentProps) => {
  const [errs, setErrs] = useState<string | undefined>("");
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
  useEffect(() => {
    if (mutationData?.modifyPaymentMethodApp?.error) {
      setErrs(mutationData.modifyPaymentMethodApp.error);
    }
  }, [mutationData]);
  message.config({
    maxCount: 1,
  });
  useEffect(() => {
    if (mutationData?.modifyPaymentMethodApp?.ok) {
      message.success(t("saveChangesSuccessful"), 4);
    }
  }, [mutationData, t]);
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
            onChange={() => setErrs(undefined)}
            onFinish={(values) => {
              updatePayment({
                variables: {
                  data: values,
                  appId,
                },
              });
            }}
            validateMessages={{ required: t("requiredInput") }}
          >
            <Form.Item
              name="stripeTestPublic"
              label={t("testPublicKey")}
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="stripeTestSecret"
              label={t("testPrivateKey")}
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="stripeProdPublic"
              label={t("prodPublicKey")}
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="stripeProdSecret"
              label={t("prodPrivateKey")}
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
            <Space direction="vertical" size="middle">
              {errs && (
                <Errors
                  errors={{
                    nonFieldErrors: [
                      {
                        message: t(`appErrors.${errs}`) || "Error",
                        code: errs,
                      },
                    ],
                  }}
                />
              )}
              <Button htmlType="submit" type="primary">
                {t("updateStripeKeys")}
              </Button>
            </Space>
          </Form>
        </Collapse.Panel>
      </Collapse>
    </>
  );
};

export default AppPayment;
