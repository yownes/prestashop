/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccountAccountStatus, BuildBuildStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: MyAccount
// ====================================================

export interface MyAccount_me_customer_defaultPaymentMethod {
  __typename: "StripePaymentMethodType";
  /**
   * The ID of the object.
   */
  id: string;
}

export interface MyAccount_me_customer_paymentMethods_edges_node {
  __typename: "StripePaymentMethodType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * If this is a card PaymentMethod, this hash contains details about the card.
   */
  card: string;
}

export interface MyAccount_me_customer_paymentMethods_edges {
  __typename: "StripePaymentMethodTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: MyAccount_me_customer_paymentMethods_edges_node | null;
}

export interface MyAccount_me_customer_paymentMethods {
  __typename: "StripePaymentMethodTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (MyAccount_me_customer_paymentMethods_edges | null)[];
}

export interface MyAccount_me_customer {
  __typename: "StripeCustomerType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * default payment method used for subscriptions and invoices for the customer.
   */
  defaultPaymentMethod: MyAccount_me_customer_defaultPaymentMethod | null;
  /**
   * Customer to which this PaymentMethod is saved.This will not be set when the PaymentMethod has not been saved to a Customer.
   */
  paymentMethods: MyAccount_me_customer_paymentMethods;
}

export interface MyAccount_me_apps_edges_node_storeLinks {
  __typename: "StoreLinks";
  ios: string | null;
  android: string | null;
}

export interface MyAccount_me_apps_edges_node_builds_edges_node {
  __typename: "BuildType";
  /**
   * The ID of the object.
   */
  id: string;
  buildStatus: BuildBuildStatus;
}

export interface MyAccount_me_apps_edges_node_builds_edges {
  __typename: "BuildTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: MyAccount_me_apps_edges_node_builds_edges_node | null;
}

export interface MyAccount_me_apps_edges_node_builds {
  __typename: "BuildTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (MyAccount_me_apps_edges_node_builds_edges | null)[];
}

export interface MyAccount_me_apps_edges_node {
  __typename: "StoreAppType";
  /**
   * The ID of the object.
   */
  id: string;
  logo: string | null;
  name: string;
  storeLinks: MyAccount_me_apps_edges_node_storeLinks | null;
  builds: MyAccount_me_apps_edges_node_builds;
}

export interface MyAccount_me_apps_edges {
  __typename: "StoreAppTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: MyAccount_me_apps_edges_node | null;
}

export interface MyAccount_me_apps {
  __typename: "StoreAppTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (MyAccount_me_apps_edges | null)[];
}

export interface MyAccount_me {
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
   * The user's Stripe Customer object, if it exists
   */
  customer: MyAccount_me_customer | null;
  apps: MyAccount_me_apps;
}

export interface MyAccount {
  me: MyAccount_me | null;
}
