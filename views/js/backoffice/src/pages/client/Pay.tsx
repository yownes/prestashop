import React from "react";
import { Card } from "antd";
import RateTable, { Feature, Rate } from "../../components/organisms/RateTable";

const features: Feature[] = [
  { id: "1", title: "Esto es una característica la mar de maja" },
  { id: "2", title: "Esto es una característica la mar de maja" },
  { id: "3", title: "Esto es una característica la mar de maja" },
  { id: "4", title: "Esto es una característica la mar de maja" },
  { id: "5", title: "Esto es una característica la mar de maja" },
  { id: "6", title: "Esto es una característica la mar de maja" },
];

const rates: Rate[] = [
  {
    id: "1",
    title: "Simply App",
    subtitle: "Tu tienda en formato App",
    price: 50,
    features: ["1", "2", "3", "4"],
  },
  {
    id: "2",
    title: "Your Own eShop",
    subtitle: "Para grandes tiendas online",
    price: 50,
    features: ["1", "2", "3", "4", "5", "6"],
  },
];

const Pay = () => {
  return (
    <Card>
      <RateTable features={features} rates={rates} onSelected={console.log} />
    </Card>
  );
};

export default Pay;
