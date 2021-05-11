/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccountAccountStatus, PlanInterval } from "./globalTypes";

// ====================================================
// GraphQL fragment: AccountBasicData
// ====================================================

export interface AccountBasicData_subscription_plan_product {
  __typename: "StripeProductType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * The product's name, meant to be displayable to the customer. Applicable to both `service` and `good` types.
   */
  name: string;
}

export interface AccountBasicData_subscription_plan {
  __typename: "StripePlanType";
  /**
   * Amount (as decimal) to be charged on the interval specified.
   */
  amount: number | null;
  /**
   * The frequency with which a subscription should be billed.
   */
  interval: PlanInterval;
  /**
   * Three-letter ISO currency code
   */
  currency: string;
  /**
   * The product whose pricing this plan determines.
   */
  product: AccountBasicData_subscription_plan_product | null;
}

export interface AccountBasicData_subscription {
  __typename: "StripeSubscriptionType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * End of the current period for which the subscription has been invoiced. At the end of this period, a new invoice will be created.
   */
  currentPeriodEnd: any;
  /**
   * The plan associated with this subscription. This value will be `null` for multi-plan subscriptions
   */
  plan: AccountBasicData_subscription_plan | null;
}

export interface AccountBasicData {
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
   * Designates whether the user can log into this admin site.
   */
  isStaff: boolean;
  /**
   * The user's Stripe Subscription object, if it exists
   */
  subscription: AccountBasicData_subscription | null;
}
