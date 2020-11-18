import React, { useState } from "react";
import { Button, Col, Drawer, Popconfirm, Radio, Row } from "antd";
import CreditCard from "../../components/molecules/CreditCard";
import { useMutation, useQuery } from "@apollo/client";
import { MY_PAYMENT_METHODS } from "../../api/queries";
import { MyPaymentMethods } from "../../api/types/MyPaymentMethods";
import Loading from "../../components/atoms/Loading";
import Title from "antd/lib/typography/Title";
import CreateCreditCard from "../../components/organisms/CreateCreateCard";
import { ADD_PAYMENT_METHOD, REMOVE_PAYMENT_METHOD } from "../../api/mutations";
import {
  AddPaymentMethod,
  AddPaymentMethodVariables,
} from "../../api/types/AddPaymentMethod";
import connectionToNodes from "../../lib/connectionToNodes";
import {
  RemovePaymentMethod,
  RemovePaymentMethodVariables,
} from "../../api/types/RemovePaymentMethod";

const PaymentMethod = () => {
  const { data, loading } = useQuery<MyPaymentMethods>(MY_PAYMENT_METHODS);
  const [addPayment] = useMutation<AddPaymentMethod, AddPaymentMethodVariables>(
    ADD_PAYMENT_METHOD
  );
  const [removePaymentMethod] = useMutation<
    RemovePaymentMethod,
    RemovePaymentMethodVariables
  >(REMOVE_PAYMENT_METHOD);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  if (loading) {
    return <Loading />;
  }
  return (
    <Row gutter={20}>
      <Col span={24}>
        <Title level={2}>Tarjeta por defecto</Title>
        <Radio.Group
          value={data?.me?.customer?.defaultPaymentMethod?.stripeId}
          onChange={(e) => {
            addPayment({ variables: { paymentMethodId: e.target.value } });
          }}
        >
          {connectionToNodes(data?.me?.customer?.paymentMethods).map((node) => (
            <Radio key={node.id} value={node.stripeId}>
              <CreditCard data={node.card} billing={node.billingDetails} />
              <Popconfirm
                title={"¿Realmente deseas eliminar la tarjeta?"}
                placement="topLeft"
                onConfirm={() => {
                  if (node.stripeId) {
                    removePaymentMethod({
                      variables: { paymentMethodId: node.stripeId },
                    });
                  }
                }}
              >
                <Button danger>Eliminar</Button>
              </Popconfirm>
            </Radio>
          ))}
        </Radio.Group>
      </Col>
      <Col span={24}>
        <Button onClick={() => setIsDrawerOpen(true)}>Cambiar Tarjeta</Button>
      </Col>
      <Drawer
        width={720}
        visible={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <CreateCreditCard
          onCreated={(paymentMethodId) => {
            addPayment({
              variables: {
                paymentMethodId,
              },
            });
          }}
        />
      </Drawer>
    </Row>
  );
};

export default PaymentMethod;
