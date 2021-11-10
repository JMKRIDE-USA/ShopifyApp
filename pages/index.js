import { Heading, Page } from "@shopify/polaris";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
export const ACCESS_SCOPE_QUERY = gql`
  query AccessScopeQuery {
    app {
      installation {
        accessScopes {
          description,
          handle
        }
      }
    }
  }
`
export const ORDER_QUERY = gql`
  query OrdersQuery {
    orders(first: 100000){
      edges {
        node {
          id,
          createdAt,
          discountCode,
        }
      }
    }
  }
`;

const GET_SUBSCRIPTIONS = gql`
  query webhookSubscriptions {
    edges {
      node {
        id,
        topic,
        endpoint {
          __typename
          ... on WebhookHttpEndpoint {
            callbackUrl
          }
          ... on WebhookEventBridgeEndpoint {
            arn
          }
          ... on WebhookPubSubEndpoint {
            pubSubProject
            pubSubTopic
          }
        }
      }
    }
  }
`

function Index() {
  const { loading, error, data } = useQuery(ORDER_QUERY);
  console.log({ loading, error, data });
  return (
    <Page>
      <Heading>JMKRIDE Custom Shopify App</Heading>
    </Page>
  )
};

export default Index;
