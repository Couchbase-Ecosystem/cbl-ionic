// CustomLoggingTests.tsx
import React, { useState } from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { CustomLoggingTests } from 'cbl-ionic';

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
