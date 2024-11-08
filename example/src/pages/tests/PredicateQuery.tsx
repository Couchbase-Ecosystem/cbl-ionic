// PredicateQuery.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { PredicateQueryTests } from '../../cblite-js-tests/cblite-tests/e2e/predicate-query-test';

const PredicateQueryTestPage: React.FC = () => {

  return (
    <DetailPageTestContainerRunner
      navigationTitle="Predicate Query Tests"
      collapseTitle="Predicate Query Tests"
      testCases={[PredicateQueryTests]}
    ></DetailPageTestContainerRunner>
  );
};
export default PredicateQueryTestPage;
