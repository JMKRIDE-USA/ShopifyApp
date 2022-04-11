
import React, { useState, useCallback } from "react";
import { 
  Form, Button, Card, ResourceList, ResourceItem,
  Icon, TextStyle, TextField, Select, FormLayout,
} from "@shopify/polaris";
import { useMutation } from '@apollo/client';
import { BiBroadcast, BiXCircle } from 'react-icons/bi';

import { ambassadorsiteEndpoint } from "../environment";
import { allowedWebhookTopics } from '../config';
import { DELETE_SUBSCRIPTION, CREATE_HTTPS_SUBSCRIPTION } from '../modules/webhooks';


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
  const [topic, setTopic] = useState(allowedWebhookTopics[0]);
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

const SubscriptionsCard = ({subscriptionData}) => {
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

export default SubscriptionsCard;