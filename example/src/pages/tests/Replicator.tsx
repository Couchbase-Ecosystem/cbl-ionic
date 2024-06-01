// Replicator.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { ReplicatorTests } from 'cbl-ionic';

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
