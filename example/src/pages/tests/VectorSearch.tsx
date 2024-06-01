// VectorSearch.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { VectorSearchTests } from 'cbl-ionic';

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
