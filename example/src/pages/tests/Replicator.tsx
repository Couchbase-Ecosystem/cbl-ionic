// Replicator.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { ReplicatorTests } from 'cblite-tests';

const ReplicatorTestsPage: React.FC = () => {
  return (
    <DetailPageTestContainerRunner
      navigationTitle="Replicator Tests"
      collapseTitle="Replicator Tests"
      testCases={[ReplicatorTests]}
    ></DetailPageTestContainerRunner>
  );
};
export default ReplicatorTestsPage;
