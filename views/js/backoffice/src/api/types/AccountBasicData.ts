/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccountAccountStatus } from "./globalTypes";

// ====================================================
// GraphQL fragment: AccountBasicData
// ====================================================

export interface AccountBasicData {
  __typename: "UserNode";
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
}
