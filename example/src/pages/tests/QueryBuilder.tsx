// QueryBuilder.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { QueryBuilderTests } from 'cblite-tests';

const QueryBuilderTestPage: React.FC = () => {
  return (
    <DetailPageTestContainerRunner
      navigationTitle="QueryBuilder Tests"
      collapseTitle="QueryBuilder Tests"
      testCases={[QueryBuilderTests]}
    ></DetailPageTestContainerRunner>
  );
};
export default QueryBuilderTestPage;
