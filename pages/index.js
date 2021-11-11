import { Heading, Page, Button } from "@shopify/polaris";
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';

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
    orders(first: 10){
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
// ... on WebhookHttpEndpoint {
//   callbackUrl
// }
// ... on WebhookPubSubEndpoint {
//   pubSubTopic
// }

const GET_SUBSCRIPTIONS = gql`
  query webhookSubscriptions {
    webhookSubscriptions(first: 10){
      edges {
        node {
          id,
          topic,
          endpoint {
            __typename,
          }
        }
      }
    }
  }
`
const CREATE_SUBSCRIPTION = gql`
  mutation {
    eventBridgeWebhookSubscriptionCreate(
      topic: ORDERS_CREATE
      webhookSubscription: {
        arn: "arn:aws:events:us-east-2::event-source/aws.partner/shopify.com/6034237/AmbassadorSiteSource"
        format: JSON
      }
    ) {
      webhookSubscription {
        id
      }
      userErrors {
        message
      }
    }
  }
`

function Index() {
  const { loading: queryLoading, error: queryError, data: queryData } = useQuery(GET_SUBSCRIPTIONS);
  const [mutateFunction, { data: mutationData, loading: mutationLoading, error: mutationError }] = useMutation(CREATE_SUBSCRIPTION);

  console.log({ queryLoading, queryError, queryData });
  console.log({ mutationData, mutationLoading, mutationError });

  return (
    <Page>
      <Heading>JMKRIDE Custom Shopify App</Heading>
      <p>{JSON.stringify(queryData)}</p>
      <Button onClick={mutateFunction}>Create Subscription</Button>
    </Page>
  )
};

export default Index;
