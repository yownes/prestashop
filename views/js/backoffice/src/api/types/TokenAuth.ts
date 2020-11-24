/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: TokenAuth
// ====================================================

export interface TokenAuth_tokenAuth_user {
  __typename: "UserNode";
  /**
   * The ID of the object.
   */
  id: string;
  email: string;
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   */
  username: string;
  firstName: string;
  lastName: string;
  /**
   * Designates whether the user can log into this admin site.
   */
  isStaff: boolean;
  verified: boolean | null;
}

export interface TokenAuth_tokenAuth {
  __typename: "ObtainJSONWebToken";
  token: string | null;
  refreshToken: string | null;
  success: boolean | null;
  errors: any | null;
  user: TokenAuth_tokenAuth_user | null;
}

export interface TokenAuth {
  /**
   * Obtain JSON web token for given user.
   * 
   * Allow to perform login with different fields,
   * and secondary email if set. The fields are
   * defined on settings.
   * 
   * Not verified users can login by default. This
   * can be changes on settings.
   * 
   * If user is archived, make it unarchive and
   * return `unarchiving=True` on output.
   */
  tokenAuth: TokenAuth_tokenAuth | null;
}

export interface TokenAuthVariables {
  password: string;
  email?: string | null;
  username?: string | null;
}
