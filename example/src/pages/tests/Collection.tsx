// Collection.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { CollectionTests } from 'cbl-ionic';

const CollectionTestsPage: React.FC = () => {
  return (
    <DetailPageTestContainerRunner
      navigationTitle="Collection Tests"
      collapseTitle="Collection Tests"
      testCases={[CollectionTests]}
    ></DetailPageTestContainerRunner>
  );
};
export default CollectionTestsPage;
