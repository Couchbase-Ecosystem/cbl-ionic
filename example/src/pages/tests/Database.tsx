// Database.tsx
import React from "react";
import DetailPageTestContainerRunner from "../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer";

import { DatabaseTests } from "../../cblite-js-tests/cblite-tests/e2e/database-test";

const DatabaseTestsPage: React.FC = () => {
  return (
    <DetailPageTestContainerRunner
      navigationTitle="Database Tests"
      collapseTitle="Database Tests"
      testCases={[DatabaseTests]}
    ></DetailPageTestContainerRunner>
  );
};
export default DatabaseTestsPage;
