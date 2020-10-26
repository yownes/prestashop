import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import React from "react";
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

const RateTable = ({ rates, features, onSelected }: RateTableProps) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Características</th>
          {rates.map((rate) => (
            <th key={rate.id}>
              <RateSelection {...rate} onSelected={onSelected} />
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
  );
};

export default RateTable;
