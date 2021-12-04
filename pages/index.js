import React, { useState } from "react";
import { 
  Heading, Page, Button, Badge, List, Card, SkeletonPage, 
  SkeletonDisplayText, SkeletonBodyText, ResourceList, ResourceItem, Icon, TextStyle,
} from "@shopify/polaris";
import { useQuery } from '@apollo/client';
import { BiBroadcast } from 'react-icons/bi';

import { ambassadorsiteEndpoint } from "../environment.js";
import { GET_ACCESS_SCOPES, GET_SUBSCRIPTIONS } from '../modules/webhooks.js';
import { QueryLoader } from '../modules/data.js';

const SubscriptionItem = (deleteSubscription) => ({ node }) => (
  <li key={node.id}>
    <p>{node.id} : {node.topic} : {node.endpoint?.callbackUrl}</p>
    <Button destructive onClick={() => deleteSubscription({ variables: { id: node.id } })}>Delete</Button>
  </li>
)

const ValidateConfigBadge = ({ accessScopeData, subscriptionData }) => {
  const configurationStatus = (() => {
    if (!accessScopeData.app.installation.accessScopes.map(s => s.handle).includes('read_orders'))
      return ({ status: "critical", text: "Access Scope Not Found!" })
    if (!subscriptionData.webhookSubscriptions.edges.map(n => n.node.endpoint?.callbackUrl).includes(ambassadorsiteEndpoint))
      return ({ status: "critical", text: "Subscription Not Found!" })
    return ({ status: "success", text: "All Good!" })
  })()
  return (
    <Badge style={{ marginLeft: "100px" }} size="medium" status={configurationStatus.status}>{configurationStatus.text}</Badge>
  )
}

const AccessScopeList = ({ data }) => {
  return <List type="bullet">
    {data.app.installation.accessScopes.map(scope => (
      <List.Item key={scope.handle}>{scope.handle}</List.Item>
    ))}
  </List>
}

const SubscriptionList = ({ data }) => {
  console.log(data)
  const [selectedItems, setSelectedItems] = useState([]);
  const bulkActions = [{
    content: 'Delete',
    onAction: () => console.log("nah")
  }]
  return <ResourceList 
    resourceName={{singular: "Subscription", plural: "Subscriptions"}}
    selectedItems={selectedItems}
    onSelectionChange={setSelectedItems}
    bulkActions={bulkActions}
    items={data.webhookSubscriptions.edges.map(n => ({
      id: n.node.id,
      topic: n.node.topic,
      endpoint: n.node.endpoint?.callbackUrl,
      createdAt: new Date(n.node.createdAt).toString()
    }))}
    renderItem={({id, topic, endpoint, createdAt}) => (
      <ResourceItem id={id} media={<Icon source={()=> <BiBroadcast size={30}/>}/>}>
        <h3>
          <TextStyle variation="strong">
            {topic}
          </TextStyle>
        </h3>
        <p><TextStyle variation="strong">Created: </TextStyle>{createdAt}</p>
        <p><TextStyle variation="subdued">{endpoint}</TextStyle></p>
      </ResourceItem>
    )}
  />
}

function LoadedIndex({ accessScopeData, subscriptionData }) {
  return (<>
    <Heading element="h1">
      JMKRIDE Custom Shopify App{" "}
      <ValidateConfigBadge {...{ accessScopeData, subscriptionData }} />
    </Heading>
    <Card title="Access Scopes" sectioned>
      <AccessScopeList data={accessScopeData} />
    </Card>
    <Card title="Subscriptions" sectioned>
      <SubscriptionList data={subscriptionData} />
    </Card>
  </>)
}

function Index() {
  const accessScopeQuery = useQuery(GET_ACCESS_SCOPES);
  // const subscriptionQuery  = useQuery(GET_SUBSCRIPTIONS, {variables: {first: 10}});
  // const [deleteSubscription, mutationQuery] = useMutation(DELETE_SUBSCRIPTION, {refetchQueries: ["webhookSubscriptions"]})
  const IndexPageSkeleton = () => (
    <SkeletonPage primaryAction>
      <Card sectioned>
        <SkeletonDisplayText size="small" />
        <SkeletonBodyText />
      </Card>
      <Card sectioned>
        <SkeletonDisplayText size="small" />
        <SkeletonBodyText />
      </Card>
    </SkeletonPage>
  )
  return (
    <Page>
      <QueryLoader query={GET_ACCESS_SCOPES} dataPropname="accessScopeData"
        loadingComponent={IndexPageSkeleton}
      >
        <QueryLoader
          query={GET_SUBSCRIPTIONS}
          queryOptions={{ variables: { first: 10 } }}
          dataPropname="subscriptionData"
          loadingComponent={IndexPageSkeleton}
        >
          <LoadedIndex />
        </QueryLoader>
      </QueryLoader>
    </Page>
  )
};

export default Index;