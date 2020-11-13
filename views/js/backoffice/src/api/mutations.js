import { gql } from "@apollo/client";

/**
 * AUTH
 */

export const TOKEN_AUTH = gql`
  mutation TokenAuth($password: String!, $email: String, $username: String) {
    tokenAuth(password: $password, email: $email, username: $username) {
      token
      refreshToken
      success
      errors
      user {
        username
        firstName
        lastName
        isStaff
        verified
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register(
    $email: String!
    $username: String!
    $password1: String!
    $password2: String!
  ) {
    register(
      email: $email
      username: $username
      password1: $password1
      password2: $password2
    ) {
      success
      errors
      token
      refreshToken
    }
  }
`;

export const VERIFY_TOKEN = gql`
  mutation VerifyToken($token: String!) {
    verifyToken(token: $token) {
      payload
      success
      errors
    }
  }
`;

export const VERIFY_ACCOUNT = gql`
  mutation VerifyAccount($token: String!) {
    verifyAccount(token: $token) {
      success
      errors
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      token
      refreshToken
      success
      errors
    }
  }
`;

export const PASSWORD_CHANGE = gql`
  mutation PasswordChange(
    $oldPassword: String!
    $newPassword1: String!
    $newPassword2: String!
  ) {
    passwordChange(
      oldPassword: $oldPassword
      newPassword1: $newPassword1
      newPassword2: $newPassword2
    ) {
      success
      errors
      token
      refreshToken
    }
  }
`;

/**
 * APP
 */

export const UPDATE_APP = gql`
  mutation UpdateApp($data: StoreAppInput!, $id: ID!) {
    updateApp(data: $data, id: $id) {
      ok
      error
    }
  }
`;

export const DELETE_APP = gql`
  mutation DeleteApp($id: ID!) {
    deleteApp(id: $id) {
      ok
      error
    }
  }
`;

export const MODIFY_APP_PAYMENT = gql`
  mutation ModifyAppPayment($data: PaymentMethodAppInput!, $appId: ID!) {
    modifyPaymentMethodApp(data: $data, storeAppId: $appId) {
      ok
      error
    }
  }
`;

export const CREATE_APP = gql`
  mutation CreateApp($data: StoreAppInput!) {
    createApp(data: $data) {
      ok
      error
      storeApp {
        id
      }
    }
  }
`;

/**
 * ACCOUNT
 */

 export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($password: String!) {
    deleteAccount(password: $password) {
      success
      errors
    }
  }
 `

 export const BAN_USER = gql`
   mutation BanUser($ban: Boolean!, $userId: ID!) {
     banUser(ban: $ban, userId: $userId) {
       ok
       error
     }
   }
 `;

/**
 * PAYMENTS
 */

export const ADD_PAYMENT_METHOD = gql`
  mutation AddPaymentMethod($paymentMethodId: ID!) {
    addPaymentMethod(paymentMethodId: $paymentMethodId) {
      ok
      error
    }
  }
`;

export const SUBSCRIBE = gql`
  mutation Subscribe($paymentMethodId: ID!, $planId: ID!) {
    subscribe(paymentMethodId: $paymentMethodId, planId: $planId) {
      ok
      error
    }
  }
`;

export const UNSUBSCRIBE = gql`
  mutation Unsubscribe($userId: ID!) {
    dropOut(userId: $userId) {
      ok
      error
    }
  }
`;