import React from "react";
import { Button, Typography } from "antd";
import { Link } from "react-router-dom";
import { PlanInterval } from "../../api/types/globalTypes";
import { CheckoutLocationState } from "../../pages/client/Checkout";

import styles from "./RateSelection.module.css";

const { Text, Title } = Typography;

interface RateSelectionProps {
  subtitle?: string;
  title: string;
  plan: CheckoutLocationState;
}

const RateSelection = ({
  subtitle,
  title,
  plan,
}: RateSelectionProps) => {
  return (
    <div className={styles.container}>
      <Text>{subtitle}</Text>
      <Title level={2}>{title}</Title>
      <Title level={3}>
        <Text strong>{plan.amount}</Text>€/
        {plan.interval === PlanInterval.MONTH ? "mes" : "año"}
      </Title>
      <Link to={{ pathname: `/checkout`, state: plan }}>
        <Button type="primary">Seleccionar</Button>
      </Link>
      <Text type="secondary" style={{ display: "block" }}>
        Precio con IVA incluido
      </Text>
    </div>
  );
};

export default RateSelection;
