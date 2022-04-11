import React from 'react';

import { List } from "@shopify/polaris";


const AccessScopesList = ({ data }) => {
  return <List type="bullet">
    {data.app.installation.accessScopes.map(scope => (
      <List.Item key={scope.handle}>{scope.handle}</List.Item>
    ))}
  </List>
}

export default AccessScopesList;