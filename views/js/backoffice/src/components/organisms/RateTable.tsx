import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Switch, Table, Typography } from "antd";
import React, { useState } from "react";
import reverse from "lodash/reverse";
import { useTranslation } from "react-i18next";
import { PLANS } from "../../api/queries";
import { PlanInterval } from "../../api/types/globalTypes";
import {
  Plans,
  Plans_features,
  Plans_products_edges_node_prices_edges_node,
} from "../../api/types/Plans";
import connectionToNodes from "../../lib/connectionToNodes";
import { CheckoutLocationState } from "../../pages/client/Checkout";
import Loading from "../atoms/Loading";
import RateSelection from "../molecules/RateSelection";
import styles from "./RateTable.module.css";

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
  prices: Plans_products_edges_node_prices_edges_node[],
  interval: PlanInterval,
  name: string
): CheckoutLocationState {
  console.log(
    "Prices",
    JSON.parse(prices[0].recurring),
    JSON.parse(prices[0].recurring).interval
  );
  const plan = prices
    .filter((plan) => plan.active)
    .find(
      (plan) => JSON.parse(plan.recurring).interval.toUpperCase() === interval
    );
  console.log("plan", plan);
  if (plan) {
    return {
      ...plan,
      name,
    };
  } else {
    return {
      __typename: "StripePriceType",
      unitAmount: 0,
      id: "-1",
      stripeId: "-1",
      recurring: { interval: PlanInterval.DAY },
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
  const [interval, setInterval] = useState(PlanInterval.DAY);
  if (loading) return <Loading />;
  const nodes = reverse(connectionToNodes(data?.products));
  const dataSource = data?.features
    ?.filter<Plans_features>(notNull)
    .map((feat) => {
      console.log("feat", feat);
      const ids = nodes
        .map((node) => ({
          [node.id]: node.features.map((f) => f.id).includes(feat.id),
        }))
        .reduce((a, b) => ({ ...a, ...b }), {});
      return {
        ...feat,
        ...ids,
        key: feat.id,
      };
    });
  console.log("datasource", dataSource);
  const appsAllowed = nodes
    .map(
      (plan) =>
        plan.metadata && {
          key: "allowedApps",
          __typename: "CustomType",
          [plan.id]: JSON.parse(plan.metadata.replace(/'/g, '"')),
          name: Object.keys(JSON.parse(plan.metadata.replace(/'/g, '"'))),
        }
    )
    .reduce((a, b) => ({ ...a, ...b }), {});
  console.log("appsAllowed", appsAllowed);
  // dataSource?.push(appsAllowed);
  console.log("dataSource", dataSource);
  // const asign = [dataSource, appsAllowed];
  // console.log("ASIGN", asign);
  return (
    <>
      <Title level={2}>{t("client:selectPlan")}</Title>
      <Table
        columns={[
          {
            title: (
              <div className={styles.switch}>
                <span>{t("monthlyPayment")} </span>
                <Switch
                  checked={interval === PlanInterval.DAY}
                  onChange={(checked) => {
                    setInterval(checked ? PlanInterval.DAY : PlanInterval.WEEK);
                  }}
                />
              </div>
            ),
            dataIndex: "name",
            fixed: "left",
          },
          ...nodes.map((rate, i) => ({
            title: (
              // <></>
              <RateSelection
                key={rate.id}
                title={rate.name}
                subtitle={rate.description ?? "-"}
                plan={selectPlan(
                  connectionToNodes(rate.prices),
                  interval,
                  rate.name
                )}
                onPlanSelected={onPlanSelected}
              />
            ),
            key: rate.id,
            dataIndex: rate.id,
            render(text: any, record: Plans_features, index: number) {
              // console.log("text", text);
              return text ? (
                <CheckOutlined style={{ fontSize: 20, color: "#00ec93" }} />
              ) : (
                <CloseOutlined style={{ fontSize: 20, color: "#dd0000" }} />
              );
            },
          })),
        ]}
        pagination={false}
        //scroll={{ x: 1500 /*, y: "40vh"*/ }}
        dataSource={dataSource}
        className={styles.table}
      />
    </>
  );
};

export default RateTable;
