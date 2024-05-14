// QueryMenuItems.tsx
import { IonItem, IonLabel, IonItemDivider } from '@ionic/react';

import React from 'react';

import '../Menu.css';

const QueryMenuItems: React.FC = () => {
  return (
    <>
    <IonItemDivider>
      <i className="fa-duotone fa-pen-to-square"></i>
        <IonLabel style={{ marginLeft: 20}}>Query API</IonLabel>
     </IonItemDivider>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/query/sqlPlusPlus"
        routerDirection="none"
      >
        <IonLabel>SQL++</IonLabel>
      </IonItem>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/query/queryFTS"
        routerDirection="none"
      >
        <IonLabel>Query - FTS</IonLabel>
      </IonItem>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/query/liveQuery"
        routerDirection="none"
      >
        <IonLabel>Live Query</IonLabel>
      </IonItem>
    </>
  );
};
export default QueryMenuItems;
