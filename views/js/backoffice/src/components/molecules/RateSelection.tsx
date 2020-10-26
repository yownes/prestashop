import React from "react";
import { Button, Typography } from "antd";

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
      <Button type="primary" onClick={() => onSelected(id)}>
        Seleccionar
      </Button>
      <Text>Precio con IVA incluido</Text>
    </div>
  );
};

export default RateSelection;
