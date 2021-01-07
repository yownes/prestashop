import React, { useState } from "react";
import {
  Button,
  Col,
  Form,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Space,
  Typography,
  message,
} from "antd";
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

const { Text } = Typography;

const PaymentMethod = () => {
  const { t } = useTranslation(["client", "translation"]);
  const { data, loading } = useQuery<MyPaymentMethods>(MY_PAYMENT_METHODS);
  const [addPayment, { loading: changing, data: paymentData }] = useMutation<
    AddPaymentMethod,
    AddPaymentMethodVariables
  >(ADD_PAYMENT_METHOD);
  const [removePaymentMethod] = useMutation<
    RemovePaymentMethod,
    RemovePaymentMethodVariables
  >(REMOVE_PAYMENT_METHOD);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const handleCancel = () => {
    setIsModalOpen(false);
    setTimeout(() => form.resetFields(), 300);
  };
  message.config({
    maxCount: 1,
  });
  if (paymentData?.addPaymentMethod?.ok) {
    form.resetFields();
    message.success(t("changePasswordSuccessful"), 4);
  }

  if (loading) {
    return <Loading />;
  }
  console.log(
    "[Default payment method]",
    data?.me?.customer?.defaultPaymentMethod?.stripeId,
    loading
  );
  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        {/* <Title level={2}>{t("defaultCard")}</Title> */}
        <Radio.Group
          value={data?.me?.customer?.defaultPaymentMethod?.stripeId}
          disabled={changing}
          onChange={(e) => {
            addPayment({
              variables: { paymentMethodId: e.target.value },
              update(cache, { data: newData }) {
                if (newData?.addPaymentMethod?.ok && data?.me?.customer) {
                  cache.modify({
                    id: cache.identify({ ...data.me.customer }),
                    fields: {
                      defaultPaymentMethod(prevValue, { toReference }) {
                        const node = connectionToNodes(
                          data?.me?.customer?.paymentMethods
                        ).find((node) => node?.stripeId === e.target.value);
                        return toReference({ ...node });
                      },
                    },
                  });
                }
              },
            });
          }}
        >
          {connectionToNodes(data?.me?.customer?.paymentMethods).map((node) => (
            <Space>
              <Radio.Button
                style={{
                  //backgroundColor: "transparent",
                  borderColor: "transparent",
                  borderWidth: 0,
                }}
                key={node.id}
                value={node.stripeId}
              >
                <CreditCard data={node.card} billing={node.billingDetails} />
                <Space>
                  <Button>{t("translation:update")}</Button>
                  {node.stripeId !==
                  data?.me?.customer?.defaultPaymentMethod?.stripeId ? (
                    <Popconfirm
                      cancelText={t("cancel")}
                      okText={t("delete")}
                      title={t("warnings.card")}
                      placement="topLeft"
                      onConfirm={() => {
                        if (node.stripeId) {
                          removePaymentMethod({
                            variables: { paymentMethodId: node.stripeId },
                          });
                        }
                      }}
                    >
                      <Button danger>{t("translation:delete")}</Button>
                    </Popconfirm>
                  ) : (
                    <Text>({t("defaultCard")})</Text>
                  )}
                </Space>
              </Radio.Button>
            </Space>
          ))}
        </Radio.Group>
      </Col>
      <Col span={24}>
        <Button onClick={() => setIsModalOpen(true)} type="primary">
          {t("addPaymentMethod")}
        </Button>
      </Col>
      <Modal
        centered
        footer={null}
        onCancel={handleCancel}
        title={t("addPaymentMethod")}
        visible={isModalOpen}
      >
        <CreateCreditCard
          form={form}
          onCreated={(paymentMethodId) => {
            addPayment({
              variables: {
                paymentMethodId,
              },
            });
          }}
        />
      </Modal>
    </Row>
  );
};

export default PaymentMethod;
