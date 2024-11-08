// DocumentExpiration.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { DocumentExpirationTests } from '../../cblite-js-tests/cblite-tests/e2e/document-expiration-test';

const DocumentExpirationTestsPage: React.FC = () => {

  return (
    <DetailPageTestContainerRunner
      navigationTitle="Doc Expiration Tests"
      collapseTitle="Doc Expiration Tests"
      testCases={[DocumentExpirationTests]}
    ></DetailPageTestContainerRunner>
  );
};
export default DocumentExpirationTestsPage;
