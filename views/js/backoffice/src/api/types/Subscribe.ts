/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Subscribe
// ====================================================

export interface Subscribe_subscribe {
  __typename: "Return";
  ok: boolean | null;
  error: string | null;
}

export interface Subscribe {
  subscribe: Subscribe_subscribe | null;
}

export interface SubscribeVariables {
  paymentMethodId: string;
  priceId: string;
}
