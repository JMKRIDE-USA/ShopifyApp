import React from "react";

import { 
  Heading, Page, Card, SkeletonPage, 
  SkeletonDisplayText, SkeletonBodyText, Layout, 
} from "@shopify/polaris";

import { 
  GET_ACCESS_SCOPES, GET_SUBSCRIPTIONS,
} from '../modules/webhooks';
import { QueryLoader } from '../modules/data';
import ConfigStatus from './ConfigStatus';
import AccessScopesList from './AccessScopesList';
import SubscriptionsCard from './SubscriptionsCard';


function LoadedIndex({ accessScopeData, subscriptionData }) {
  return (<>
    <Heading element="h1">
      Configuration Status:{" "}
      <ConfigStatus {...{ accessScopeData, subscriptionData }} />
    </Heading>
    <Card title="Access Scopes" sectioned>
      <AccessScopesList data={accessScopeData} />
    </Card>
    <SubscriptionsCard subscriptionData={subscriptionData}/>
  </>)
}

function HomePage() {
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
    <Page fullWidth>
      <Layout>
        <Layout.Section>
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
        </Layout.Section>
      </Layout>
    </Page>
  )
};

export default HomePage;