// All.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import {
	ConsoleLoggingTests,
	CollectionTests,
	CustomLoggingTests,
	DatabaseTests,
	DocumentTests,
	DocumentExpirationTests,
	FileLoggingTests,
	FragmentTests,
	IndexingTests,
	ListenerTests,
	PredicateQueryTests,
	QueryTests,
	ReplicatorTests
} from 'cblite-tests';

const AllTestsPage: React.FC = () => {
  return (
    <DetailPageTestContainerRunner
      navigationTitle="All Tests"
      collapseTitle="All Tests"
      testCases={[
		ConsoleLoggingTests,
		CustomLoggingTests,
		DatabaseTests,
		CollectionTests,
		DocumentTests,
		DocumentExpirationTests,
		FileLoggingTests,
		FragmentTests,
		IndexingTests,
		ListenerTests,
		PredicateQueryTests,
		QueryTests,
		ReplicatorTests
	]}
    ></DetailPageTestContainerRunner>
  );
};
export default AllTestsPage;
