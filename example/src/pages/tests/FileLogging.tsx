// FileLogging.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { FileLoggingTests } from 'cbl-ionic';

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
