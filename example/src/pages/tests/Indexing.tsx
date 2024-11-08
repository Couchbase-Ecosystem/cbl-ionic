// Indexing.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { IndexingTests } from '../../cblite-js-tests/cblite-tests/e2e/indexing-test';

const IndexingTestPage: React.FC = () => {

  return (
    <DetailPageTestContainerRunner
      navigationTitle="Index Tests"
      collapseTitle="Index Tests"
      testCases={[IndexingTests]}
    ></DetailPageTestContainerRunner>
  );
};
export default IndexingTestPage;
