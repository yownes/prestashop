import React from "react";
import { Card } from "antd";
import RateTable from "../../components/organisms/RateTable";
import rates from "../../data/rates.json";
import features from "../../data/features.json";

const Pay = () => {
  return (
    <Card>
      <RateTable features={features} rates={rates} onSelected={console.log} />
    </Card>
  );
};

export default Pay;
