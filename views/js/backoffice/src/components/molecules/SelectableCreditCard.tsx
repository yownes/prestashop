import React from "react";
import CreditCard from "./CreditCard";
import { PaymentMethod } from "@stripe/stripe-js";

import { colors } from "../../lib/colors";

interface SelectableCreditCardProps {
  data: PaymentMethod;
  onSelected: () => void;
  selected: boolean;
}

const SelectableCreditCard = ({
  data,
  onSelected,
  selected,
}: SelectableCreditCardProps) => {
  return (
    <div
      onClick={onSelected}
      style={{
        border: selected ? `1px solid ${colors.primary}` : "1px solid #FFF",
        borderRadius: 20,
        marginBottom: 5,
        cursor: "pointer",
      }}
    >
      <CreditCard
        data={JSON.stringify(data?.card)}
        billing={JSON.stringify(data?.billing_details)}
      />
    </div>
  );
};

export default SelectableCreditCard;
