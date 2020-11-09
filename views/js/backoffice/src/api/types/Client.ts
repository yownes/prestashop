/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccountAccountStatus, BuildBuildStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: Client
// ====================================================

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
  buildId: any;
  date: any;
  buildStatus: BuildBuildStatus;
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
  name: string;
  logo: string | null;
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
  apps: Client_user_apps;
}

export interface Client {
  user: Client_user | null;
}

export interface ClientVariables {
  id: string;
}
