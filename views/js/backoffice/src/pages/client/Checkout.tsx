import React, { useState } from "react";
import { Button, Card, Result, Space, Steps } from "antd";
import {
  EuroCircleOutlined,
  CheckCircleOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Link, Redirect } from "react-router-dom";
import { AccountAccountStatus } from "../../api/types/globalTypes";
import { MyAccount } from "../../api/types/MyAccount";
import { Plans_products_edges_node_prices_edges_node } from "../../api/types/Plans";
import { MY_ACCOUNT } from "../../api/queries";
import Loading from "../../components/atoms/Loading";
import CheckoutForm from "../../components/molecules/CheckoutForm";
import { RateTable } from "../../components/organisms";
import { useTranslation } from "react-i18next";

export interface CheckoutLocationState
  extends Plans_products_edges_node_prices_edges_node {
  name: string;
}

const { Step } = Steps;

const Checkout = () => {
  const { data } = useQuery<MyAccount>(MY_ACCOUNT);
  const [current, setCurrent] = useState(0);
  const [plan, setPlan] = useState<CheckoutLocationState>();
  const { t } = useTranslation("client");
  const prev = () => {
    setCurrent(current - 1);
  };
  if (!data?.me?.accountStatus) {
    return <Loading />;
  }
  if (!plan && current !== 0) {
    setCurrent(0);
  }
  // if (data?.me?.accountStatus !== AccountAccountStatus.REGISTERED) {
  //   if (current === 0) {
  //     return <Redirect to="/profile" />;
  //   }
  //   if (current === 3) {
  //     return <Redirect to="/profile" />;
  //   }
  // }
  return (
    <Card>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Steps current={current} style={{ padding: 30 }}>
          <Step
            icon={<TableOutlined />}
            key={0}
            title={t("subscriptionSteps.plan")}
          />
          <Step
            icon={<EuroCircleOutlined />}
            key={1}
            title={t("subscriptionSteps.pay")}
          />
          <Step
            icon={<CheckCircleOutlined />}
            key={2}
            title={t("subscriptionSteps.end")}
          />
        </Steps>
      </Space>
      {current === 0 && (
        <Card>
          <RateTable
            onPlanSelected={(plan: CheckoutLocationState) => {
              setPlan(plan);
              setCurrent(1);
            }}
          />
        </Card>
      )}
      {current === 1 && (
        <>
          <Card>
            <CheckoutForm plan={plan!} onSubscribed={() => setCurrent(2)} />
          </Card>
          <Button style={{ marginTop: 20 }} onClick={() => prev()}>
            {t("changePlan")}
          </Button>
        </>
      )}
      {current === 2 && (
        <Result
          status="success"
          title={t("subscribeSuccessful")}
          subTitle={t("subscribeDescriptionSuccessful")}
          extra={[
            <Link to="/profile">
              <Button type="primary" onClick={() => setCurrent(3)}>
                {t("goProfile")}
              </Button>
            </Link>,
          ]}
        ></Result>
      )}
    </Card>
  );
};

export default Checkout;
