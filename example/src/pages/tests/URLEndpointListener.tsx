// Replicator.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { URLEndpointListenerTests } from '../../cblite-js-tests/cblite-tests/e2e/url-endpoint-listener-test';

const URLEndpointListenerTestsPage: React.FC = () => {
  return (
    <DetailPageTestContainerRunner
      navigationTitle="URLEndpointListener Tests"
      collapseTitle="URLEndpointListener Tests"
      testCases={[URLEndpointListenerTests]}
    ></DetailPageTestContainerRunner>
  );
};
export default URLEndpointListenerTestsPage;
