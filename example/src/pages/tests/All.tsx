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
		ReplicatorTests
	]}
    ></DetailPageTestContainerRunner>
  );
};
export default AllTestsPage;
