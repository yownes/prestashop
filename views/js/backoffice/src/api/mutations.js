import { gql } from "@apollo/client";

/**
 * AUTH
 */

export const TOKEN_AUTH = gql`
  mutation TokenAuth($password: String!, $email: String, $username: String) {
    tokenAuth(password: $password, email: $email, username: $username) {
      token
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

/**
 * APP
 */

export const UPDATE_APP = gql`
  mutation UpdateApp($data: StoreAppInput!, $id: ID) {
    updateApp(data: $data, id: $id) {
      ok
      error
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