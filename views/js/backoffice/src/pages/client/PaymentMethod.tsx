import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Popconfirm,
  Row,
  Space,
  Typography,
  message,
  Alert,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import CreditCard from "../../components/molecules/CreditCard";
import { useMutation, useQuery } from "@apollo/client";
import { MY_PAYMENT_METHODS } from "../../api/queries";
import {
  MyPaymentMethods,
  MyPaymentMethods_me_customer_paymentMethods_edges_node,
} from "../../api/types/MyPaymentMethods";
import Loading from "../../components/atoms/Loading";
import LoadingFullScreen from "../../components/atoms/LoadingFullScreen";
import CreateCreditCard from "../../components/organisms/CreateCreditCard";
import EditCreditCard from "../../components/organisms/EditCreditCard";
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
import { Link } from "react-router-dom";

const { Text } = Typography;

const PaymentMethod = () => {
  const { t } = useTranslation(["translation", "client"]);
  const { data, loading } = useQuery<MyPaymentMethods>(MY_PAYMENT_METHODS);
  const [addPayment, { loading: changing, data: paymentData }] = useMutation<
    AddPaymentMethod,
    AddPaymentMethodVariables
  >(ADD_PAYMENT_METHOD, {
    refetchQueries: [{ query: MY_PAYMENT_METHODS }],
  });
  const [
    removePaymentMethod,
    { loading: removing, data: removeData },
  ] = useMutation<RemovePaymentMethod, RemovePaymentMethodVariables>(
    REMOVE_PAYMENT_METHOD
  );
  const [isModalCreateOpen, setisModalCreateOpen] = useState(false);
  const [isModalUpdateOpen, setisModalUpdateOpen] = useState(false);
  const [isAdded, setisAdded] = useState(false);
  const [isUpdated, setisUpdated] = useState(false);
  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState<MyPaymentMethods_me_customer_paymentMethods_edges_node>();
  const [cardId, setCardId] = useState<string | null>(null);
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
      if (isAdded) {
        formCreate.resetFields();
        message.success(t("client:addPaymentMethodSuccessful"), 4);
        setisAdded(false);
      }
      if (isUpdated) {
        setisModalUpdateOpen(false);
        formUpdate.resetFields();
        message.success(t("client:updatePaymentMethodSuccessful"), 4);
        setisUpdated(false);
      }
    }
  }, [formCreate, formUpdate, isAdded, isUpdated, paymentData, t]);
  useEffect(() => {
    if (removeData?.detachPaymentMethod?.ok) {
      message.success(t("client:removePaymentMethodSuccessful"), 4);
    }
  }, [removeData, t]);

  if (loading) return <Loading />;

  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Space size="large" wrap>
          {data?.me?.customer ? (
            connectionToNodes(data?.me?.customer?.paymentMethods).map(
              (node) => (
                <Card
                  bodyStyle={{
                    padding: 0,
                  }}
                  bordered={false}
                  key={node.stripeId}
                >
                  <CreditCard data={node.card} billing={node.billingDetails} />
                  <Space size="middle">
                    {node.stripeId !==
                    data?.me?.customer?.defaultPaymentMethod?.stripeId ? (
                      <>
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => {
                            setPaymentMethod(node);
                            setisModalUpdateOpen(true);
                          }}
                        />
                        <Popconfirm
                          cancelText={t("cancel")}
                          okText={t("delete")}
                          title={t("client:warnings.card")}
                          placement="topLeft"
                          onConfirm={() => {
                            if (node.stripeId) {
                              removePaymentMethod({
                                variables: { paymentMethodId: node.stripeId },
                                update(cache, { data: newData }) {
                                  if (
                                    newData?.detachPaymentMethod?.ok &&
                                    data?.me?.customer
                                  ) {
                                    cache.evict({
                                      id: cache.identify({
                                        ...node,
                                      }),
                                    });
                                    cache.gc();
                                  }
                                },
                              });
                            }
                          }}
                        >
                          <Button danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                        <Popconfirm
                          onConfirm={(e) => {
                            addPayment({
                              variables: { paymentMethodId: cardId!! },
                              update(cache, { data: newData }) {
                                if (
                                  newData?.addPaymentMethod?.ok &&
                                  data?.me?.customer
                                ) {
                                  cache.modify({
                                    id: cache.identify({ ...data.me.customer }),
                                    fields: {
                                      defaultPaymentMethod(
                                        prevValue,
                                        { toReference }
                                      ) {
                                        const node = connectionToNodes(
                                          data?.me?.customer?.paymentMethods
                                        ).find(
                                          (node) => node?.stripeId === cardId
                                        );
                                        return toReference({ ...node });
                                      },
                                    },
                                  });
                                }
                              },
                            });
                            setisUpdated(true);
                          }}
                          title={t("client:warnings.cardDefault")}
                        >
                          <Button onClick={() => setCardId(node.stripeId)}>
                            {t("client:asDefault")}
                          </Button>
                        </Popconfirm>
                      </>
                    ) : (
                      <>
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => {
                            setPaymentMethod(node);
                            setisModalUpdateOpen(true);
                          }}
                        />
                        <Text strong>({t("client:defaultCard")})</Text>
                      </>
                    )}
                  </Space>
                </Card>
              )
            )
          ) : (
            <Alert
              action={
                <Link to="/checkout">
                  <Button
                    size="small"
                    style={{ marginLeft: 20 }}
                    type="primary"
                  >
                    {t("client:subscribe")}
                  </Button>
                </Link>
              }
              showIcon
              message={t("client:subscribeNowPayment")}
              type="warning"
            />
          )}
        </Space>
      </Col>
      <Col span={24}>
        <Button
          disabled={!data?.me?.customer}
          onClick={() => setisModalCreateOpen(true)}
          type="primary"
        >
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
            setisAdded(true);
            setisModalCreateOpen(false);
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
        {isModalUpdateOpen && (
          <EditCreditCard
            payment={paymentMethod!!}
            form={formUpdate}
            onEdited={(paymentMethodId) => {
              addPayment({
                variables: {
                  paymentMethodId,
                },
              });
              setisUpdated(true);
              setisModalUpdateOpen(false);
            }}
          />
        )}
      </Modal>
      {changing && (
        <LoadingFullScreen
          tip={
            isAdded
              ? t("client:addingPaymentMethod")
              : t("client:updatingPaymentMethod")
          }
        />
      )}
      {removing && (
        <LoadingFullScreen tip={t("client:removingPaymentMethod")} />
      )}
    </Row>
  );
};

export default PaymentMethod;
