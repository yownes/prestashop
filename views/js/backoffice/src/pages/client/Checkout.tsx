import React from "react";
import { Redirect, useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Plans_plans_edges_node_planSet_edges_node } from "../../api/types/Plans";
import CheckoutForm from "../../components/molecules/CheckoutForm";

const stripePromise = loadStripe("pk_test_RG1KlTBaXWs8pCamCoLixIIu00FTwuG937");

const Checkout = () => {
  const { state: plan } = useLocation<
    Plans_plans_edges_node_planSet_edges_node
  >();
  if (!plan) {
    return <Redirect to={"/pay"} />;
  }
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm plan={plan} />
    </Elements>
  );
};

export default Checkout;
