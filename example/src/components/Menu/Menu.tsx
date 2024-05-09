// Menu.tsx
import React from 'react';

import {
  IonContent,
  IonHeader,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import {
  DatabaseMenuItems,
  CollectionMenuItems,
  DocumentMenuItems,
  QueryMenuItems,
  IndexMenuItems,
  LoggingMenuItems,
  ReplicationMenuItems,
  TestMenuItems,
} from './NavigationMenu/';

import './Menu.css';

const Menu: React.FC = () => {
  return (
    <IonMenu contentId="main" type="overlay">
      <IonHeader>
        <IonToolbar>
          <IonTitle>CBLite API</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonMenuToggle autoHide={false}>
          <TestMenuItems />
          <LoggingMenuItems />
          <DatabaseMenuItems />
          <CollectionMenuItems />
          <DocumentMenuItems />
          <IndexMenuItems />
          <QueryMenuItems />
          <ReplicationMenuItems />
        </IonMenuToggle>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;