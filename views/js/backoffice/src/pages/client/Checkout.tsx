import React from "react";
import { Redirect, useLocation } from "react-router-dom";
import { Plans_plans_edges_node_planSet_edges_node } from "../../api/types/Plans";
import CheckoutForm from "../../components/molecules/CheckoutForm";

export interface CheckoutLocationState
  extends Plans_plans_edges_node_planSet_edges_node {
  name: string;
}

const Checkout = () => {
  const { state: plan } = useLocation<CheckoutLocationState>();
  if (!plan) {
    return <Redirect to={"/pay"} />;
  }
  return <CheckoutForm plan={plan} />;
};

export default Checkout;
