// Collection.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { TestingTests } from '../../cblite-js-tests/cblite-tests/e2e/testing-test';

const TestingTestsPage: React.FC = () => {
  return (
    <DetailPageTestContainerRunner
      navigationTitle="Testing Tests"
      collapseTitle="Testing Tests"
      testCases={[TestingTests]}
    ></DetailPageTestContainerRunner>
  );
};
export default TestingTestsPage;
