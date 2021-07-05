/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BuildStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: GenerateApp
// ====================================================

export interface GenerateApp_generateApp {
  __typename: "GenerateAppMutation";
  state: BuildStatus | null;
}

export interface GenerateApp {
  generateApp: GenerateApp_generateApp | null;
}

export interface GenerateAppVariables {
  appId: string;
}
