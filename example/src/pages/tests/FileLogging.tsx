// FileLogging.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { FileLoggingTests } from '../../cblite-js-tests/cblite-tests/e2e/file-logging-test';

const FileLoggingTestsPage: React.FC = () => {

  return (
    <DetailPageTestContainerRunner
      navigationTitle="File Logging Tests"
      collapseTitle="File Loggin Tests"
      testCases={[FileLoggingTests]}
    >

    </DetailPageTestContainerRunner>
  );
};
export default FileLoggingTestsPage;
