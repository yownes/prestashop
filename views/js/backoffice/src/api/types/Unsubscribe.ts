/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Unsubscribe
// ====================================================

export interface Unsubscribe_dropOut {
  __typename: "Return";
  ok: boolean | null;
  error: string | null;
}

export interface Unsubscribe {
  dropOut: Unsubscribe_dropOut | null;
}

export interface UnsubscribeVariables {
  userId: string;
}
