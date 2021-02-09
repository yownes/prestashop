import React, { useEffect, useState } from "react";
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
  const { t } = useTranslation(["translation", "client"]);
  const { data, loading } = useQuery<MyPaymentMethods>(MY_PAYMENT_METHODS);
  const [addPayment, { loading: changing, data: paymentData }] = useMutation<
    AddPaymentMethod,
    AddPaymentMethodVariables
  >(ADD_PAYMENT_METHOD);
  const [removePaymentMethod, { data: removeData }] = useMutation<
    RemovePaymentMethod,
    RemovePaymentMethodVariables
  >(REMOVE_PAYMENT_METHOD);
  const [isModalCreateOpen, setisModalCreateOpen] = useState(false);
  const [isModalUpdateOpen, setisModalUpdateOpen] = useState(false);
  const [isUpdated, setisUpdated] = useState(false);
  const [formCreate] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const handleCancelCreate = () => {
    setisModalCreateOpen(false);
    setTimeout(() => formCreate.resetFields(), 300);
  };
  const handleCancelUpdate = () => {
    setisModalUpdateOpen(false);
    setTimeout(() => formUpdate.resetFields(), 300);
  };
  message.config({
    maxCount: 1,
  });
  useEffect(() => {
    if (paymentData?.addPaymentMethod?.ok) {
      if (isUpdated) {
        setisModalUpdateOpen(false);
        formUpdate.resetFields();
        message.success(t("client:updatePaymentMethodSuccessful"), 4);
        setisUpdated(false);
      } else {
        setisModalCreateOpen(false);
        formCreate.resetFields();
        message.success(t("client:addPaymentMethodSuccessful"), 4);
      }
    }
  }, [formCreate, formUpdate, isUpdated, paymentData, t]);
  useEffect(() => {
    if (removeData?.detachPaymentMethod?.ok) {
      message.success(t("client:removePaymentMethodSuccessful"), 4);
    }
  }, [removeData, t]);

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
                  setisUpdated(true);
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
                  <Button onClick={() => setisModalUpdateOpen(true)}>
                    {t("update")}
                  </Button>
                  {node.stripeId !==
                  data?.me?.customer?.defaultPaymentMethod?.stripeId ? (
                    <Popconfirm
                      cancelText={t("cancel")}
                      okText={t("delete")}
                      title={t("client:warnings.card")}
                      placement="topLeft"
                      onConfirm={() => {
                        if (node.stripeId) {
                          removePaymentMethod({
                            variables: { paymentMethodId: node.stripeId },
                          });
                        }
                      }}
                    >
                      <Button danger>{t("delete")}</Button>
                    </Popconfirm>
                  ) : (
                    <Text>({t("client:defaultCard")})</Text>
                  )}
                </Space>
              </Radio.Button>
            </Space>
          ))}
        </Radio.Group>
      </Col>
      <Col span={24}>
        <Button onClick={() => setisModalCreateOpen(true)} type="primary">
          {t("client:addPaymentMethod")}
        </Button>
      </Col>
      <Modal
        centered
        footer={null}
        onCancel={handleCancelCreate}
        title={t("client:addPaymentMethod")}
        visible={isModalCreateOpen}
      >
        <CreateCreditCard
          form={formCreate}
          onCreated={(paymentMethodId) => {
            addPayment({
              variables: {
                paymentMethodId,
              },
            });
          }}
        />
      </Modal>
      <Modal
        centered
        footer={null}
        onCancel={handleCancelUpdate}
        title={t("client:editPaymentMethod")}
        visible={isModalUpdateOpen}
      >
        <CreateCreditCard
          form={formUpdate}
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
