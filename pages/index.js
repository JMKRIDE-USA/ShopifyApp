import { Heading, Page, Button } from "@shopify/polaris";
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
import { node } from "prop-types";
import React from "react";

const GET_ACCESS_SCOPES = gql`
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
const GET_SUBSCRIPTIONS = gql`
  query webhookSubscriptions($first: Int!) {
    webhookSubscriptions(first: $first){
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
  mutation eventBridgeWebhookSubscriptionCreate(
    $webhookSubscription: EventBridgeWebhookSubscriptionInput!
  ){
    eventBridgeWebhookSubscriptionCreate(
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
const DELETE_SUBSCRIPTION = gql`
  mutation webhookSubscriptionDelete($id: ID!) {
    webhookSubscriptionDelete(id: $id) {
      userErrors {
        field
        message
      }
    }
  }
`

const SubscriptionItem = (deleteSubscription) => ({ node }) => (
  <li key={node.id}>
    <p>{node.id} : {node.topic}</p>
    <Button destructive onClick={() => deleteSubscription({variables: {id: node.id}})}>Delete</Button>
  </li>
)

function Index() {
  const accessScopeQuery = useQuery(GET_ACCESS_SCOPES);
  const { loading: queryLoading, error: queryError, data: queryData } = useQuery(GET_SUBSCRIPTIONS, {variables: {first: 10}});
  const [mutateFunction, { data: mutationData, loading: mutationLoading, error: mutationError }] = useMutation(
    CREATE_SUBSCRIPTION, {
      variables: {
        webhookSubscription: {
          arn: "arn:aws:events:us-east-2::event-source/aws.partner/shopify.com/6034237/AmbassadorSiteSource",
          format: "JSON"
        }
      },
      refetchQueries: ["webhookSubscriptions"],
    }
  );

  const [deleteSubscription, mutationQuery] = useMutation(DELETE_SUBSCRIPTION, {refetchQueries: ["webhookSubscriptions"]})
  console.log(mutationQuery)

  console.log({ queryLoading, queryError, queryData });
  console.log({ mutationData, mutationLoading, mutationError });

  return (
    <Page>
      <Heading>JMKRIDE Custom Shopify App</Heading>
      {accessScopeQuery.data && 
        <React.Fragment>
          <p>AccessScopes:</p>
          <ul>{(accessScopeQuery.data.app.installation.accessScopes || []).map(scope => <li key={scope.handle}>{scope.handle}</li>)}</ul>
        </React.Fragment>
      }
      {queryData && 
        <React.Fragment>
          Subscriptions:
          <ul>{ queryData.webhookSubscriptions.edges.map(SubscriptionItem(deleteSubscription)) }</ul>
        </React.Fragment>
      }
      <Button onClick={mutateFunction}>Create Subscription</Button>
    </Page>
  )
};

export default Index;
