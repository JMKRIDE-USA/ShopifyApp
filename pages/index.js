import React, { useState, useCallback } from "react";
import { 
  Form, Heading, Page, Button, Badge, List, Card, SkeletonPage, 
  SkeletonDisplayText, SkeletonBodyText, ResourceList, ResourceItem, Icon, TextStyle, TextField, Select, FormLayout,
} from "@shopify/polaris";
import { useMutation } from '@apollo/client';
import { BiBroadcast, BiXCircle } from 'react-icons/bi';

import { ambassadorsiteEndpoint, ambassadorsiteTopic } from "../environment.js";
import { allowedWebhookTopics } from '../config.js';
import { 
  GET_ACCESS_SCOPES, GET_SUBSCRIPTIONS,
  DELETE_SUBSCRIPTION, CREATE_HTTPS_SUBSCRIPTION 
} from '../modules/webhooks.js';
import { QueryLoader } from '../modules/data.js';

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

const SubscriptionList = ({ data, setCreating }) => {
  const [deleteSubscription, mutationQuery] = useMutation(DELETE_SUBSCRIPTION, {refetchQueries: ["webhookSubscriptions"]})
  return <ResourceList 
    resourceName={{singular: "Subscription", plural: "Subscriptions"}}
    loading={mutationQuery.loading}
    alternateTool={<Button onClick={() => setCreating(true)}>Create Subscription</Button>}
    items={data.webhookSubscriptions.edges.map(n => ({
      id: n.node.id,
      topic: n.node.topic,
      endpoint: n.node.endpoint?.callbackUrl,
      createdAt: new Date(n.node.createdAt).toString()
    }))}
    renderItem={({id, topic, endpoint, createdAt}) => (
      <ResourceItem id={id}
        media={<Icon source={()=> <BiBroadcast size={30}/>}/>}
        shortcutActions={{content: 'Delete', onAction: () => deleteSubscription({variables: {id}})}}
      >
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

export const SubscriptionCreationForm = ({setCreating}) => {
  const [endpoint, setEndpoint] = useState(ambassadorsiteEndpoint)
  const [topic, setTopic] = useState(ambassadorsiteTopic);
  const handleEndpointChange = useCallback((n) => setEndpoint(n), []);
  const [
    mutateFunction, {loading},
  ] = useMutation(
    CREATE_HTTPS_SUBSCRIPTION, {
      variables: {topic, webhookSubscription: {callbackUrl: endpoint, format: "JSON"}},
      refetchQueries: ["webhookSubscriptions"],
      onCompleted: () => setCreating(false),
    }
  );
  return (
    <Form onSubmit={mutateFunction}>
      <FormLayout>
        <TextField style={{minWidth: "500px"}} label='Endpoint' value={endpoint} onChange={handleEndpointChange} autoComplete="off"
          connectedLeft={<Select options={allowedWebhookTopics} onChange={setTopic} value={topic}/>}
          connectedRight={<Button onClick={() => setCreating(false)}><BiXCircle size={20}/></Button>}
        />
        <Button loading={loading} submit primary>Create Subscription</Button>
      </FormLayout>
    </Form>
  );
}

const SubscriptionCard = ({subscriptionData}) => {
  const [creating, setCreating] = useState(false);
  return (
    <Card title="Subscriptions" sectioned>
      {creating &&
        <Card.Section>
          <SubscriptionCreationForm setCreating={setCreating}/>
        </Card.Section>
      }
      <Card.Section>
        <SubscriptionList data={subscriptionData} setCreating={setCreating}/>
      </Card.Section>
    </Card>
  )
}

function LoadedIndex({ accessScopeData, subscriptionData }) {
  return (<>
    <Heading element="h1">
      Configuration Status:{" "}
      <ValidateConfigBadge {...{ accessScopeData, subscriptionData }} />
    </Heading>
    <Card title="Access Scopes" sectioned>
      <AccessScopeList data={accessScopeData} />
    </Card>
    <SubscriptionCard subscriptionData={subscriptionData}/>
  </>)
}

function Index() {
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