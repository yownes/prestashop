/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanInterval } from "./globalTypes";

// ====================================================
// GraphQL query operation: Plans
// ====================================================

export interface Plans_plans_edges_node_product {
  __typename: "StripeProductType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * The product's name, meant to be displayable to the customer. Applicable to both `service` and `good` types.
   */
  name: string;
  /**
   * A description of this object.
   */
  description: string | null;
  /**
   * A set of key/value pairs that you can attach to an object. It can be useful for storing additional information about an object in a structured format.
   */
  metadata: string | null;
}

export interface Plans_plans_edges_node {
  __typename: "StripePlanType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * The frequency with which a subscription should be billed.
   */
  interval: PlanInterval;
  /**
   * Amount (as decimal) to be charged on the interval specified.
   */
  amount: number | null;
  /**
   * The product whose pricing this plan determines.
   */
  product: Plans_plans_edges_node_product | null;
}

export interface Plans_plans_edges {
  __typename: "StripePlanTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: Plans_plans_edges_node | null;
}

export interface Plans_plans {
  __typename: "StripePlanTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (Plans_plans_edges | null)[];
}

export interface Plans {
  plans: Plans_plans | null;
}
