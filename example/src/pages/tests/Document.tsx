// Document.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { DocumentTests } from 'cbl-ionic';

const DocumentTestsPage: React.FC = () => {

  return (
    <DetailPageTestContainerRunner
      navigationTitle="Document Tests"
      collapseTitle="Document Tests"
      testCases={[DocumentTests]}
    ></DetailPageTestContainerRunner>
  );
};
export default DocumentTestsPage;
