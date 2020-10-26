import React from "react";
import { Button, Typography } from "antd";
import { Link } from "react-router-dom";

const { Text, Title } = Typography;

interface RateSelectionProps {
  id: string;
  subtitle?: string;
  title: string;
  price: number;
  onSelected: (id: string) => void;
}

const RateSelection = ({
  id,
  subtitle,
  title,
  price,
  onSelected,
}: RateSelectionProps) => {
  return (
    <div>
      <Text>{subtitle}</Text>
      <Title>{title}</Title>
      <Title>
        <Text strong>{price}</Text>€ al mes
      </Title>
      <Link to={`/checkout/${id}`}>
        <Button type="primary" onClick={() => onSelected(id)}>
          Seleccionar
        </Button>
      </Link>
      <Text>Precio con IVA incluido</Text>
    </div>
  );
};

export default RateSelection;
