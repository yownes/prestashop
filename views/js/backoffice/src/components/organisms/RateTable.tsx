import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Switch, Table, Typography } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PLANS } from "../../api/queries";
import { PlanInterval } from "../../api/types/globalTypes";
import {
  Plans,
  Plans_features,
  Plans_plans_edges_node_planSet_edges_node,
} from "../../api/types/Plans";
import connectionToNodes from "../../lib/connectionToNodes";
import { CheckoutLocationState } from "../../pages/client/Checkout";
import Loading from "../atoms/Loading";
import RateSelection from "../molecules/RateSelection";

const { Title } = Typography;

export interface Rate {
  title: string;
  subtitle?: string;
  price: number;
  id: string;
  features: string[];
}

export interface Feature {
  title: string;
  id: string;
}

interface RateTableProps {
  onPlanSelected: (plan: CheckoutLocationState) => void;
}

function selectPlan(
  plans: Plans_plans_edges_node_planSet_edges_node[],
  interval: PlanInterval,
  name: string
): CheckoutLocationState {
  const plan = plans
    .filter((plan) => plan.active)
    .find((plan) => plan.interval === interval);
  if (plan) {
    return {
      ...plan,
      name,
    };
  } else {
    return {
      __typename: "StripePlanType",
      amount: 0,
      id: "-1",
      stripeId: "-1",
      interval: PlanInterval.MONTH,
      name,
      active: true,
    };
  }
}

function notNull(
  value: Plans_features | null,
  index: number,
  array: (Plans_features | null)[]
): value is Plans_features {
  return (value as Plans_features).id !== undefined;
}

const RateTable = ({ onPlanSelected }: RateTableProps) => {
  const { t } = useTranslation("client");
  const { data, loading } = useQuery<Plans>(PLANS);
  const [interval, setInterval] = useState(PlanInterval.MONTH);
  if (loading) return <Loading />;
  const nodes = connectionToNodes(data?.plans);
  const dataSource = data?.features
    ?.filter<Plans_features>(notNull)
    .map((feat) => {
      const ids = nodes
        .map((node) => ({
          [node.id]: node.features.map((f) => f.id).includes(feat.id),
        }))
        .reduce((a, b) => ({ ...a, ...b }), {});
      return {
        ...feat,
        ...ids,
      };
    });
  return (
    <>
      <Title level={2}>{t("client:selectPlan")}</Title>
      <Table
        columns={[
          {
            title: (
              <>
                <span>{t("monthlyPayment")} </span>
                <Switch
                  checked={interval === PlanInterval.MONTH}
                  onChange={(checked) => {
                    setInterval(
                      checked ? PlanInterval.MONTH : PlanInterval.YEAR
                    );
                  }}
                />
              </>
            ),
            dataIndex: "name",
            fixed: "left",
          },
          ...nodes.map((rate, i) => ({
            title: (
              <RateSelection
                key={rate.id}
                title={rate.name}
                subtitle={rate.description ?? "-"}
                plan={selectPlan(
                  connectionToNodes(rate.planSet),
                  interval,
                  rate.name
                )}
                onPlanSelected={onPlanSelected}
              />
            ),
            key: rate.id,
            dataIndex: rate.id,
            render(text: any, record: Plans_features, index: number) {
              return text ? (
                <CheckOutlined style={{ fontSize: 20, color: "#00ec93" }} />
              ) : (
                <CloseOutlined style={{ fontSize: 20, color: "#dd0000" }} />
              );
            },
          })),
        ]}
        pagination={false}
        scroll={{ x: 1500 /*, y: "40vh"*/ }}
        dataSource={dataSource}
      />
    </>
  );
};

export default RateTable;
