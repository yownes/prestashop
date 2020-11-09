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

export const ACCOUNT_BASIC_DATA_FRAGMENT = gql`
  fragment AccountBasicData on UserNode {
    username
    email
    accountStatus
    verified
    isActive
  }
`;

export const MY_ACCOUNT = gql`
  query MyAccount {
    me {
      id
      ...AccountBasicData
      customer {
        id
        defaultPaymentMethod {
          id
        }
        paymentMethods {
          edges {
            node {
              id
              card
            }
          }
        }
      }
      apps {
        edges {
          node {
            id
            logo
            name
            storeLinks {
              ios
              android
            }
            builds {
              edges {
                node {
                  id
                  buildStatus
                }
              }
            }
          }
        }
      }
    }
  }
  ${ACCOUNT_BASIC_DATA_FRAGMENT}
`;

export const TEMPLATES = gql`
  query Templates {
    templates {
      edges {
        node {
          id
          name
          previewImg
        }
      }
    }
  }
`;

export const APP = gql`
  query App($id: ID!) {
    app(id: $id) {
      id
      name
      color {
        color
        text
      }
      apiLink
      template {
        id
      }
      logo
      builds {
        edges {
          node {
            id
            buildStatus
          }
        }
      }
      storeLinks {
        ios
        android
      }
    }
  }
`;

export const PLANS = gql`
  query Plans {
    plans {
      edges {
        node {
          id
          name
          description
          planSet {
            edges {
              node {
                id
                stripeId
                amount
                interval
                active
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * ADMIN
 */

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

export const CLIENT = gql`
  query Client($id: ID!) {
    user(id: $id) {
      id
      ...AccountBasicData
      apps {
        edges {
          node {
            id
            name
            logo
            apiLink
            storeLinks {
              ios
              android
            }
            builds {
              edges {
                node {
                  id
                  buildId
                  date
                  buildStatus
                }
              }
            }
          }
        }
      }
    }
  }
  ${ACCOUNT_BASIC_DATA_FRAGMENT}
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