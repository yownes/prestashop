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

export const BUILDS = gql`
  query Builds($first: Int, $last: Int) {
    builds(first: $first, last: $last) {
      edges {
        node {
          id
          buildId
          date
          buildStatus
          app {
            id
            name
            customer {
              id
              username
            }
          }
        }
      }
    }
  }
`;