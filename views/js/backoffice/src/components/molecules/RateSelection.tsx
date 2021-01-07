import React from "react";
import { Button, Typography } from "antd";
import { Link } from "react-router-dom";
import { PlanInterval } from "../../api/types/globalTypes";
import { CheckoutLocationState } from "../../pages/client/Checkout";

import styles from "./RateSelection.module.css";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("translation");
  return (
    <div className={styles.container}>
      <Text>{subtitle}</Text>
      <Title level={2}>{title}</Title>
      <Title level={3}>
        <Text strong>{plan.amount}</Text>€/
        {plan.interval === PlanInterval.MONTH ? t("month") : t("year")}
      </Title>
      <Link to={{ pathname: `/checkout`, state: plan }}>
        <Button type="primary">{t("select")}</Button>
      </Link>
      <Text type="secondary" style={{ display: "block" }}>
        {t("priceWithTaxes")}
      </Text>
    </div>
  );
};

export default RateSelection;
