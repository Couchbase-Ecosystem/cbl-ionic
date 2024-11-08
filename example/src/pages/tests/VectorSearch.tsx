// VectorSearch.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { VectorSearchTests } from '../../cblite-js-tests/cblite-tests/e2e/vector-search-test';

const VectorSearchTestsPage: React.FC = () => {
  return (
    <DetailPageTestContainerRunner
      navigationTitle="Vector Search Tests"
      collapseTitle="Vector Search Tests"
      testCases={[VectorSearchTests]}
    ></DetailPageTestContainerRunner>
  );
};
export default VectorSearchTestsPage;
