// ConsoleLogging.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { ConsoleLoggingTests } from 'cblite-tests';

const ConsoleLoggingTestsPage: React.FC = () => {

  return (
    <DetailPageTestContainerRunner
      navigationTitle="Console Logging Tests"
      collapseTitle="Console Logging Tests"
      testCases={[ConsoleLoggingTests]}
    ></DetailPageTestContainerRunner>
  );
};
export default ConsoleLoggingTestsPage;
