/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Unsubscribe
// ====================================================

export interface Unsubscribe_dropOutUser {
  __typename: "Return";
  ok: boolean | null;
  error: string | null;
}

export interface Unsubscribe {
  dropOutUser: Unsubscribe_dropOutUser | null;
}

export interface UnsubscribeVariables {
  userId: string;
}
