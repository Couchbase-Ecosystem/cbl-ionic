// Notifications.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { ListenerTests } from '../../cblite-js-tests/cblite-tests/e2e/listener-test';

const NotificationsTestPage: React.FC = () => {

  return (
    <DetailPageTestContainerRunner
      navigationTitle="Listener Tests"
      collapseTitle="Listener Tests"
      testCases={[ListenerTests]}
    ></DetailPageTestContainerRunner>
  );
};
export default NotificationsTestPage;
