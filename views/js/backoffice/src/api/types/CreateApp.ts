/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { StoreAppInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateApp
// ====================================================

export interface CreateApp_createApp_storeApp {
  __typename: "StoreAppType";
  /**
   * The ID of the object.
   */
  id: string;
}

export interface CreateApp_createApp {
  __typename: "CreateStoreAppMutation";
  ok: boolean | null;
  error: string | null;
  storeApp: CreateApp_createApp_storeApp | null;
}

export interface CreateApp {
  createApp: CreateApp_createApp | null;
}

export interface CreateAppVariables {
  data: StoreAppInput;
}
