import React from "react";
import { Button, Typography } from "antd";
import { Link } from "react-router-dom";
import { Plans_plans_edges_node_planSet_edges_node } from "../../api/types/Plans";
import { PlanInterval } from "../../api/types/globalTypes";

const { Text, Title } = Typography;

interface RateSelectionProps {
  id: string;
  subtitle?: string;
  title: string;
  plan: Plans_plans_edges_node_planSet_edges_node;
  onSelected: (id: string) => void;
}

const RateSelection = ({
  id,
  subtitle,
  title,
  plan,
  onSelected,
}: RateSelectionProps) => {
  return (
    <div>
      <Text>{subtitle}</Text>
      <Title>{title}</Title>
      <Title>
        <Text strong>{plan.amount}</Text>€/
        
        {plan.interval === PlanInterval.MONTH ? "mes" : "año"}
      </Title>
      <Link to={{pathname :`/checkout`, state: plan}}>
        <Button type="primary" onClick={() => onSelected(id)}>
          Seleccionar
        </Button>
      </Link>
      <Text>Precio con IVA incluido</Text>
    </div>
  );
};

export default RateSelection;
