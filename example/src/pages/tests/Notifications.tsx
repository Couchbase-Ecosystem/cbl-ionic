// Notifications.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { ListenerTests } from 'cbl-ionic';

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
