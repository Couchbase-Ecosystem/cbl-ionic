// CustomLoggingTests.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { CustomLoggingTests } from '../../cblite-js-tests/cblite-tests/e2e/custom-logging-test';

const CustomLoggingTestsPage: React.FC = () => {

  return (
    <DetailPageTestContainerRunner
      navigationTitle="Custom Logging Tests"
      collapseTitle="Custom Logging Tests"
      testCases={[CustomLoggingTests]}
    ></DetailPageTestContainerRunner>
  );
};
export default CustomLoggingTestsPage;
