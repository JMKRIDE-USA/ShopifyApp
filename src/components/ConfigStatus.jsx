import React from 'react';

import { Badge } from "@shopify/polaris";

import { ambassadorsiteEndpoint } from '../environment';

const ConfigStatus = ({ accessScopeData, subscriptionData }) => {
  const statuses = []
  if (!accessScopeData.app.installation.accessScopes.map(s => s.handle).includes('read_orders'))
    statuses.push({ status: "critical", text: "'read_orders' Access Scope Not Found!" })
  if (!ambassadorsiteEndpoint)
    statuses.push({ status: "critical", text: "Ambassadorsite Endpoint not configured!" })
  if (!subscriptionData.webhookSubscriptions.edges.map(n => n.node.endpoint?.callbackUrl).includes(ambassadorsiteEndpoint))
    statuses.push({ status: "critical", text: "Webhook Not Found/Endpoint Misconfigured" })
  if(!statuses.length)
    statuses.push({ status: "success", text: "All Good!" })
  return statuses.map(({status, text}, index) => 
    <Badge style={{ marginLeft: "100px" }} size="medium" status={status} key={index}>{text}</Badge>
  )
}

export default ConfigStatus;