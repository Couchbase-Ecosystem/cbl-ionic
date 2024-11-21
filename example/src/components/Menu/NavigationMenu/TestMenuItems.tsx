// TestMenuItems.tsx
import {
    IonItem,
    IonLabel,
    IonItemDivider
}
    from '@ionic/react';

import React from 'react';

const TestMenuItems: React.FC = () => {
    return (
        <>
            <IonItemDivider>
                <i className="fa-duotone fa-person-running-fast"></i>
                <IonLabel style={{marginLeft: 20}}>Test Runners</IonLabel>
            </IonItemDivider>
            <IonItem
                style={{marginLeft: 20}}
                routerLink="/tests/consoleLogging"
                routerDirection="none">
                <IonLabel>Console Logging</IonLabel>
            </IonItem>
            <IonItem
                style={{marginLeft: 20}}
                routerLink="/tests/databases"
                routerDirection="none">
                <IonLabel>Database</IonLabel>
            </IonItem>
			<IonItem
				style={{marginLeft: 20}}
				routerLink="/tests/collections"
				routerDirection="none">
				<IonLabel>Collection</IonLabel>
			</IonItem>
            <IonItem
                style={{marginLeft: 20}}
                routerLink="/tests/document"
                routerDirection="none">
                <IonLabel>Document</IonLabel>
            </IonItem>
            <IonItem
                style={{marginLeft: 20}}
                routerLink="/tests/documentExpiration"
                routerDirection="none">
                <IonLabel>Document Expiration</IonLabel>
            </IonItem>
            <IonItem
                style={{marginLeft: 20}}
                routerLink="/tests/indexes"
                routerDirection="none">
                <IonLabel>Indexes</IonLabel>
            </IonItem>
            <IonItem
                style={{marginLeft: 20}}
                routerLink="/tests/notifications"
                routerDirection="none">
                <IonLabel>Notifications</IonLabel>
            </IonItem>
            <IonItem
                style={{marginLeft: 20}}
                routerLink="/tests/predicateQuery"
                routerDirection="none">
                <IonLabel>Predicate Query</IonLabel>
            </IonItem>
            <IonItem
                style={{marginLeft: 20}}
                routerLink="/tests/query"
                routerDirection="none">
                <IonLabel>Query SQL++</IonLabel>
            </IonItem>
            <IonItem
                style={{marginLeft: 20}}
                routerLink="/tests/replicator"
                routerDirection="none">
                <IonLabel>Replicator</IonLabel>
            </IonItem>
            <IonItem
                style={{marginLeft: 20}}
                routerLink="/tests/testing"
                routerDirection="none">
                <IonLabel>Testing Tests</IonLabel>
            </IonItem>
        </>
    );
};
export default TestMenuItems;
/*
     disabled not implemented yet

       <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/tests/collections"
        routerDirection="none"
      >
        <IonLabel>Collection</IonLabel>
      </IonItem>

      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/tests/customLogging"
        routerDirection="none"
      >
        <IonLabel>Custom Logging</IonLabel>
      </IonItem>

      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/tests/fileLogging"
        routerDirection="none">
        <IonLabel>File Logging</IonLabel>
      </IonItem>

      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/tests/vectorSearch"
        routerDirection="none"
      >
        <IonLabel>Vector Search</IonLabel>
      </IonItem>
*/