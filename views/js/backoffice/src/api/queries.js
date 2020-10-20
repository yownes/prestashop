import { gql } from "@apollo/client";

export const ME = gql`
  query Me {
    me {
      email
      username
      isStaff
    }
  }
`;

export const CLIENTS = gql`
  query Clients($first: Int, $last: Int) {
    users(first: $first, last: $last) {
      edges {
        node {
          id
          username
          apps {
            edges {
              node {
                id
              }
            }
          }
          accountStatus
        }
      }
    }
  }
`;