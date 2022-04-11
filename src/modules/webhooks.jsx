import gql from 'graphql-tag';

import { ambassadorsiteEndpoint } from "../environment";

export const GET_ACCESS_SCOPES = gql`
  query AccessScopeQuery {
    app {
      installation {
        accessScopes {
          handle
        }
      }
    }
  }
`
export const GET_SUBSCRIPTIONS = gql`
  query webhookSubscriptions($first: Int!) {
    webhookSubscriptions(first: $first){
      edges {
        node {
          id,
          topic,
          createdAt,
          endpoint {
            __typename
            ... on WebhookHttpEndpoint {
              callbackUrl
            }
            ... on WebhookEventBridgeEndpoint {
              arn
            }
          }
        }
      }
    }
  }
`
export const CREATE_HTTPS_SUBSCRIPTION = gql`
  mutation webhookSubscriptionCreate(
    $topic: WebhookSubscriptionTopic!,
    $webhookSubscription: WebhookSubscriptionInput!
  ){
    webhookSubscriptionCreate(
      topic: $topic,
      webhookSubscription: $webhookSubscription
    ) {
      webhookSubscription {
        id
        topic
        format
      }
      userErrors {
        field
        message
      }
    }
  }
`
export const DELETE_SUBSCRIPTION = gql`
  mutation webhookSubscriptionDelete($id: ID!) {
    webhookSubscriptionDelete(id: $id) {
      userErrors {
        field
        message
      }
    }
  }
`