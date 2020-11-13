import { useMutation, useQuery } from "@apollo/client";
import { Button, Collapse, Form, Input } from "antd";
import Title from "antd/lib/typography/Title";
import React from "react";
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

const AppPayment = ({ appId }: AppPaymentProps) => {
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
      <Title level={2}>Método de pago</Title>
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
            <Form.Item name="stripeTestPublic" label="Clave Pública (test)">
              <Input.Password />
            </Form.Item>
            <Form.Item name="stripeTestSecret" label="Clave Secreta (test)">
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="stripeProdPublic"
              label="Clave Pública (producción)"
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="stripeProdSecret"
              label="Clave Secreta (producción)"
            >
              <Input.Password />
            </Form.Item>
            <Button htmlType="submit">Actualizar claves de Stripe</Button>
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
