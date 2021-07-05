/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Resubscribe
// ====================================================

export interface Resubscribe_takeUp {
  __typename: "Return";
  ok: boolean | null;
  error: string | null;
}

export interface Resubscribe {
  takeUp: Resubscribe_takeUp | null;
}

export interface ResubscribeVariables {
  userId: string;
}
