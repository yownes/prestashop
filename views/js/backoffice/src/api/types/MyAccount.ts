/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccountAccountStatus, BuildBuildStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: MyAccount
// ====================================================

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
  apps: MyAccount_me_apps;
}

export interface MyAccount {
  me: MyAccount_me | null;
}
