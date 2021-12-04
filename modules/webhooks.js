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
    $webhookSubscription: WebhookSubscriptionInput!
  ){
    webhookSubscriptionCreate(
      topic: ORDERS_CREATE
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

const webhookQueries = [
  GET_SUBSCRIPTIONS,
]

export const WebhookCreationForm = () => {
  const [endpoint, setEndpoint] = useState(ambassadorsiteEndpoint)
  const handleEndpointChange = useCallback((n) => setEndpoint(n), []);
  const [
    mutateFunction, 
    { data: mutationData, loading: mutationLoading, error: mutationError }
  ] = useMutation(
    CREATE_HTTPS_SUBSCRIPTION, {
      variables: {
        webhookSubscription: {callbackUrl: endpoint, format: "JSON"}
      },
      refetchQueries: ["webhookSubscriptions"],
    }
  );
  return (
    <Card>
      <TextField label='Webhook Endpoint' value={endpoint} onChange={handleEndpointChange} autoComplete="off"/>
      <Button onClick={mutateFunction}>Create Subscription</Button>
    </Card>
  );
}