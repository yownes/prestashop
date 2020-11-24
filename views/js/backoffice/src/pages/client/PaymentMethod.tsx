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
import { useTranslation } from "react-i18next";

const PaymentMethod = () => {
  const { t } = useTranslation(["client", "translation"]);
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
        <Title level={2}>{t("defaultCard")}</Title>
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
                title={t("warnings.card")}
                placement="topLeft"
                onConfirm={() => {
                  if (node.stripeId) {
                    removePaymentMethod({
                      variables: { paymentMethodId: node.stripeId },
                      update(cache, { data }) {
                        if (data?.detachPaymentMethod?.ok) {
                          const ref = cache.identify({ ...node })
                          cache.evict({
                            id: ref
                          })
                          cache.gc()
                        }
                      }
                    });
                  }
                }}
              >
                <Button danger>{t("translation:delete")}</Button>
              </Popconfirm>
            </Radio>
          ))}
        </Radio.Group>
      </Col>
      <Col span={24}>
        <Button onClick={() => setIsDrawerOpen(true)}>{t("addCard")}</Button>
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
