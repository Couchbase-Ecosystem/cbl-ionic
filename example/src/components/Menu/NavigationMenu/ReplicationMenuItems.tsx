// ReplicationMenuItems.tsx
import React from 'react';

import { IonItem, IonLabel, IonItemDivider } from '@ionic/react';

import '../Menu.css';

const ReplicationMenuItems: React.FC = () => {
  return (
    <>
      <IonItemDivider>
        <i className="fa-duotone fa-rotate"></i>
        <IonLabel style={{ marginLeft: 20 }}>Replication API</IonLabel>
      </IonItemDivider>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/replication/replicatorConfig"
        routerDirection="none">
        <IonLabel>Replicator Config</IonLabel>
      </IonItem>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/replication/replicatorLive"
        routerDirection="none">
        <IonLabel>Replicator Live</IonLabel>
      </IonItem>
    </>
  );
};
export default ReplicationMenuItems;
