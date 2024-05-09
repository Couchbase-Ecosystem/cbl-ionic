// Notifications.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { NotificationTests } from '../../tests/e2e/notification-tests';

const NotificationsTestPage: React.FC = () => {

  return (
    <DetailPageTestContainerRunner
      navigationTitle="Notifications Tests"
      collapseTitle="Notifications Tests"
      testCases={[NotificationTests]}
    ></DetailPageTestContainerRunner>
  );
};
export default NotificationsTestPage;
