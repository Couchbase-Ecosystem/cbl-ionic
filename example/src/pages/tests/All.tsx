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
	PredicateQueryTests,
	QueryBuilderTests,
	QueryTests,
	ReplicatorTests
} from 'cblite-tests';

import {
	NotificationTests,
} from '../../tests/e2e/notification-tests';

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
		NotificationTests,
		PredicateQueryTests,
		QueryBuilderTests,
		QueryTests,
		ReplicatorTests
	]}
    ></DetailPageTestContainerRunner>
  );
};
export default AllTestsPage;
