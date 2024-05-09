// CollectionMenuItems.tsx
import { IonItem, IonLabel, IonItemDivider } from '@ionic/react';
import React from 'react';
import '../Menu.css';

const CollectionMenuItems: React.FC = () => {
    return (
        <>
            <IonItemDivider>
                <i className="fa-duotone fa-database"></i>
                <IonLabel style={{ marginLeft: 20}}>Collection API</IonLabel>
            </IonItemDivider>

            <IonItem
                style={{marginLeft: 20}}
                routerLink="/database/collections/scopes/default"
                routerDirection="none"
            >
                <IonLabel>Default Scope</IonLabel>
            </IonItem>
            <IonItem
                style={{ marginLeft: 20 }}
                routerLink="/database/scopes"
                routerDirection="none"
            >
                <IonLabel>List Scopes</IonLabel>
            </IonItem>
            <IonItem
                style={{marginLeft: 20}}
                routerLink="/database/collections/default"
                routerDirection="none"
            >
                <IonLabel>Default Collection</IonLabel>
            </IonItem>
            <IonItem
                style={{ marginLeft: 20 }}
                routerLink="/database/collection/create"
                routerDirection="none"
            >
                <IonLabel>Create Collection</IonLabel>
            </IonItem>
            <IonItem
                style={{ marginLeft: 20 }}
                routerLink="/database/collection/delete"
                routerDirection="none"
            >
                <IonLabel>Delete Collection</IonLabel>
            </IonItem>
            <IonItem
                style={{ marginLeft: 20 }}
                routerLink="/database/collections"
                routerDirection="none"
            >
                <IonLabel>List Collections</IonLabel>
            </IonItem>
            <IonItem
                style={{ marginLeft: 20 }}
                routerLink="/database/collection/change"
                routerDirection="none"
            >
                <IonLabel>Listen to Changes</IonLabel>
            </IonItem>
        </>
    );
};
export default CollectionMenuItems;