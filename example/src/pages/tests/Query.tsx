// Query.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { QueryTests } from 'cblite-tests';

const QueryTestPage: React.FC = () => {
  return (
    <DetailPageTestContainerRunner
      navigationTitle="Query SQL++ Tests"
      collapseTitle="Query SQL++ Tests"
      testCases={[QueryTests]}
    ></DetailPageTestContainerRunner>
  );
};
export default QueryTestPage;
