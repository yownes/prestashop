import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Switch } from "antd";
import React, { useState } from "react";
import { PLANS } from "../../api/queries";
import { PlanInterval } from "../../api/types/globalTypes";
import {
  Plans,
  Plans_plans_edges_node_planSet_edges_node,
} from "../../api/types/Plans";
import connectionToNodes from "../../lib/connectionToNodes";
import Loading from "../atoms/Loading";
import RateSelection from "../molecules/RateSelection";

import styles from "./RateTable.module.css";

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
  onSelected: (id: string) => void;
  rates: Rate[];
  features: Feature[];
}

function selectPlan(
  plans: Plans_plans_edges_node_planSet_edges_node[],
  interval: PlanInterval
): Plans_plans_edges_node_planSet_edges_node {
  return (
    plans
      .filter((plan) => plan.active)
      .find((plan) => plan.interval === interval) ?? {
      __typename: "StripePlanType",
      amount: 0,
      id: "-1",
      interval: PlanInterval.MONTH,
      active: true,
    }
  );
}

const RateTable = ({ rates, features, onSelected }: RateTableProps) => {
  const { data, loading } = useQuery<Plans>(PLANS);
  const [interval, setInterval] = useState(PlanInterval.MONTH);
  if (loading) return <Loading />;
  return (
    <>
      <p>
        Cargo mensual:{" "}
        <Switch
          checked={interval === PlanInterval.MONTH}
          onChange={(checked) => {
            setInterval(checked ? PlanInterval.MONTH : PlanInterval.YEAR);
          }}
        />
      </p>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Características</th>
            {connectionToNodes(data?.plans).map((rate) => (
              <th key={rate.id}>
                <RateSelection
                  id={rate.id}
                  title={rate.name}
                  subtitle={rate.description ?? "-"}
                  plan={selectPlan(connectionToNodes(rate.planSet), interval)}
                  onSelected={onSelected}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <tr key={feature.id}>
              <td>{feature.title}</td>
              {rates.map((rate) => (
                <td key={rate.id}>
                  {rate.features.includes(feature.id) ? (
                    <CheckOutlined style={{ fontSize: 20, color: "#00ec93" }} />
                  ) : (
                    <CloseOutlined style={{ fontSize: 20, color: "#dd0000" }} />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default RateTable;
