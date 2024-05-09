// IndexMenuItems.tsx
import { IonItem, IonLabel, IonItemDivider } from '@ionic/react';

import React from 'react';

import '../Menu.css';

const IndexMenuItems: React.FC = () => {
  return (
    <>
    <IonItemDivider>
      <i className="fa-duotone fa-magnifying-glass"></i>
        <IonLabel style={{ marginLeft: 20}}>Index API</IonLabel>
     </IonItemDivider>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/index/create"
        routerDirection="none"
      >
        <IonLabel>Create</IonLabel>
      </IonItem>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/index/createFTS"
        routerDirection="none"
      >
        <IonLabel>Create FTS</IonLabel>
      </IonItem>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/index/delete"
        routerDirection="none"
      >
        <IonLabel>Delete</IonLabel>
      </IonItem>
	  <IonItem
        lines="none"
        style={{ marginLeft: 20 }}
        routerLink="/index/list"
        routerDirection="none"
      >
        <IonLabel>List</IonLabel>
      </IonItem>
    </>
  );
};
export default IndexMenuItems;
