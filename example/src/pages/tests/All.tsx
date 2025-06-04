// All.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import {
	ConsoleLoggingTests,
	CollectionTests,
	DatabaseTests,
	DocumentTests,
	IndexingTests,
	QueryTests,
	ReplicatorTests
} from '../../cblite-js-tests/cblite-tests/';
import { URLEndpointListenerTests } from '../../cblite-js-tests/cblite-tests/e2e/url-endpoint-listener-test';

const AllTestsPage: React.FC = () => {
  return (
    <DetailPageTestContainerRunner
      navigationTitle="All Tests"
      collapseTitle="All Tests"
      testCases={[
		ConsoleLoggingTests,
		DatabaseTests,
		CollectionTests,
		DocumentTests,
		IndexingTests,
		QueryTests,
		URLEndpointListenerTests,
		ReplicatorTests
	]}
    ></DetailPageTestContainerRunner>
  );
};
export default AllTestsPage;
