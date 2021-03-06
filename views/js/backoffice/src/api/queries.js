import { gql } from "@apollo/client";

export const ME = gql`
  query Me {
    me {
      id
      email
      username
      isStaff
    }
  }
`;

export const ACCOUNT_BASIC_DATA_FRAGMENT = gql`
  fragment AccountBasicData on UserNode {
    id
    username
    email
    accountStatus
    verified
    isActive
    isStaff
    subscription {
      id
      cancelAtPeriodEnd
      created
      currentPeriodEnd
      status
      plan {
        amount
        interval
        currency
        product {
          id
          name
          prices {
            edges {
              node {
                unitAmount
                currency
                recurring
              }
            }
          }
        }
      }
    }
  }
`;

export const APP_FRAGMENT = gql`
  fragment AppBasicData on StoreAppType {
    id
    logo
    name
    isActive
    apiLink
    storeLinks {
      ios
      android
    }
    builds {
      edges {
        node {
          id
          buildStatus
          buildId
          date
        }
      }
    }
  }
`;

export const MY_PAYMENT_METHODS = gql`
  query MyPaymentMethods {
    me {
      id
      customer {
        id
        defaultPaymentMethod {
          id
          stripeId
        }
        paymentMethods {
          edges {
            node {
              id
              stripeId
              card
              billingDetails
              metadata
            }
          }
        }
      }
    }
  }
`;

export const MY_ACCOUNT = gql`
  query MyAccount {
    me {
      id
      ...AccountBasicData
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

export const APPS = gql`
  query Apps($is_active: Boolean!) {
    apps(isActive: $is_active) {
      edges {
        node {
          ...AppBasicData
        }
      }
    }
  }
  ${APP_FRAGMENT}
`;

export const APP_OWNER_ACTIVE = gql`
  query AppOwnerActive($id: ID!) {
    appcustomer(id: $id) {
      isOwnerAndActive
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
      customer {
        id
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
            date
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

export const APP_PAYMENTS = gql`
  query AppPayments($id: ID!) {
    app(id: $id) {
      id
      paymentMethod {
        id
        stripeTestPublic
        stripeTestSecret
        stripeProdPublic
        stripeProdSecret
      }
    }
  }
`;

export const PLANS = gql`
  query Plans {
    features {
      id
      name
    }
    products {
      edges {
        node {
          id
          name
          description
          metadata
          features {
            id
          }
          prices {
            edges {
              node {
                id
                stripeId
                recurring
                unitAmount
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
          subscription {
            plan {
              product {
                id
                name
              }
            }
          }
          accountStatus
          verified
          isActive
          isStaff
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
            ...AppBasicData
          }
        }
      }
    }
  }
  ${ACCOUNT_BASIC_DATA_FRAGMENT}
  ${APP_FRAGMENT}
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
            isActive
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
