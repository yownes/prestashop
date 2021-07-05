/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccountAccountStatus, SubscriptionStatus, PlanInterval, BuildBuildStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: Client
// ====================================================

export interface Client_user_subscription_plan_product {
  __typename: "StripeProductType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * The product's name, meant to be displayable to the customer. Applicable to both `service` and `good` types.
   */
  name: string;
}

export interface Client_user_subscription_plan {
  __typename: "StripePlanType";
  /**
   * Amount (as decimal) to be charged on the interval specified.
   */
  amount: number | null;
  /**
   * The frequency with which a subscription should be billed.
   */
  interval: PlanInterval;
  /**
   * Three-letter ISO currency code
   */
  currency: string;
  /**
   * The product whose pricing this plan determines.
   */
  product: Client_user_subscription_plan_product | null;
}

export interface Client_user_subscription {
  __typename: "StripeSubscriptionType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * If the subscription has been canceled with the ``at_period_end`` flag set to true, ``cancel_at_period_end`` on the subscription will be true. You can use this attribute to determine whether a subscription that has a status of active is scheduled to be canceled at the end of the current period.
   */
  cancelAtPeriodEnd: boolean;
  /**
   * The datetime this object was created in stripe.
   */
  created: any | null;
  /**
   * End of the current period for which the subscription has been invoiced. At the end of this period, a new invoice will be created.
   */
  currentPeriodEnd: any;
  /**
   * The status of this subscription.
   */
  status: SubscriptionStatus;
  /**
   * The plan associated with this subscription. This value will be `null` for multi-plan subscriptions
   */
  plan: Client_user_subscription_plan | null;
}

export interface Client_user_apps_edges_node_storeLinks {
  __typename: "StoreLinks";
  ios: string | null;
  android: string | null;
}

export interface Client_user_apps_edges_node_builds_edges_node {
  __typename: "BuildType";
  /**
   * The ID of the object.
   */
  id: string;
  buildStatus: BuildBuildStatus;
  buildId: any;
  date: any;
}

export interface Client_user_apps_edges_node_builds_edges {
  __typename: "BuildTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: Client_user_apps_edges_node_builds_edges_node | null;
}

export interface Client_user_apps_edges_node_builds {
  __typename: "BuildTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (Client_user_apps_edges_node_builds_edges | null)[];
}

export interface Client_user_apps_edges_node {
  __typename: "StoreAppType";
  /**
   * The ID of the object.
   */
  id: string;
  logo: string | null;
  name: string;
  isActive: boolean | null;
  /**
   * Link to GraphQl API of the store
   */
  apiLink: string | null;
  storeLinks: Client_user_apps_edges_node_storeLinks | null;
  builds: Client_user_apps_edges_node_builds;
}

export interface Client_user_apps_edges {
  __typename: "StoreAppTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: Client_user_apps_edges_node | null;
}

export interface Client_user_apps {
  __typename: "StoreAppTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (Client_user_apps_edges | null)[];
}

export interface Client_user {
  __typename: "UserNode";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   */
  username: string;
  email: string;
  accountStatus: AccountAccountStatus;
  verified: boolean | null;
  /**
   * Designates whether this user should be treated as active. Unselect this instead of deleting accounts.
   */
  isActive: boolean;
  /**
   * Designates whether the user can log into this admin site.
   */
  isStaff: boolean;
  /**
   * The user's Stripe Subscription object, if it exists
   */
  subscription: Client_user_subscription | null;
  apps: Client_user_apps;
}

export interface Client {
  user: Client_user | null;
}

export interface ClientVariables {
  id: string;
}
