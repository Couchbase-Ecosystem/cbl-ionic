// Database.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { DatabaseTests } from 'cbl-ionic';

const DatabaseTestsPage: React.FC = () => {

  return (
  	<DetailPageTestContainerRunner
 	 	navigationTitle="Database Tests"
  		collapseTitle="Database Tests"
		testCases={[DatabaseTests]}
		>
  	</DetailPageTestContainerRunner>
	);
};
export default DatabaseTestsPage;
