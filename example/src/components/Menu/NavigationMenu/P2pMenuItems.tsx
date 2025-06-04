// ReplicationMenuItems.tsx
import React from 'react';

import { IonItem, IonLabel, IonItemDivider } from '@ionic/react';

import '../Menu.css';

const P2pMenuItems: React.FC = () => {
  return (
    <>
      <IonItemDivider>
        <i className="fa-duotone fa-rotate"></i>
        <IonLabel style={{ marginLeft: 20 }}>Peer 2 peer API</IonLabel>
      </IonItemDivider>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/p2p/activePeer"
        routerDirection="none">
        <IonLabel>Active Peer</IonLabel>
      </IonItem>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/p2p/passivePeer"
        routerDirection="none">
        <IonLabel>Passive Peer</IonLabel>
      </IonItem>
    </>
  );
};
export default P2pMenuItems;
