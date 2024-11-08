// ConsoleLogging.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { ConsoleLoggingTests } from '../../cblite-js-tests/cblite-tests/e2e/console-logging-test';

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
