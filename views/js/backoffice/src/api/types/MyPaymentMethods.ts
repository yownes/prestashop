/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyPaymentMethods
// ====================================================

export interface MyPaymentMethods_me_customer_defaultPaymentMethod {
  __typename: "StripePaymentMethodType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * If this is a card PaymentMethod, this hash contains details about the card.
   */
  card: string;
  /**
   * Billing information associated with the PaymentMethod that may be used or required by particular types of payment methods.
   */
  billingDetails: string;
}

export interface MyPaymentMethods_me_customer {
  __typename: "StripeCustomerType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * default payment method used for subscriptions and invoices for the customer.
   */
  defaultPaymentMethod: MyPaymentMethods_me_customer_defaultPaymentMethod | null;
}

export interface MyPaymentMethods_me {
  __typename: "UserNode";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * The user's Stripe Customer object, if it exists
   */
  customer: MyPaymentMethods_me_customer | null;
}

export interface MyPaymentMethods {
  me: MyPaymentMethods_me | null;
}
