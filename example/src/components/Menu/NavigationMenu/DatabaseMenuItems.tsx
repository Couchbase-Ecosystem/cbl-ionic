// Menu.tsx
import {IonItem, IonLabel, IonItemDivider} from '@ionic/react';
import React from 'react';
import '../Menu.css';

const DatabaseMenuItems: React.FC = () => {
    return (
        <>
            <IonItemDivider>
                <i className="fa-duotone fa-database"></i>
                <IonLabel style={{marginLeft: 20}}>Database API</IonLabel>
            </IonItemDivider>
            <IonItem
                style={{marginLeft: 20}}
                routerLink="/database/setup"
                routerDirection="none"
            >
                <IonLabel>Setup</IonLabel>
            </IonItem>
            <IonItem
                style={{marginLeft: 20}}
                routerLink="/database/open"
                routerDirection="none"
            >
                <IonLabel>Open</IonLabel>
            </IonItem>
            <IonItem
                style={{marginLeft: 20}}
                routerLink="/database/close"
                routerDirection="none"
            >
                <IonLabel>Close</IonLabel>
            </IonItem>
            <IonItem
                style={{marginLeft: 20}}
                routerLink="/database/copy"
                routerDirection="none"
            >
                <IonLabel>Copy</IonLabel>
            </IonItem>
            <IonItem
                style={{marginLeft: 20}}
                routerLink="/database/delete"
                routerDirection="none"
            >
                <IonLabel>Delete</IonLabel>
            </IonItem>
            <IonItem
                style={{marginLeft: 20}}
                routerLink="/database/changeKey"
                routerDirection="none"
            >
                <IonLabel>Change Encryption Key</IonLabel>
            </IonItem>
            <IonItem
                lines="none"
                style={{marginLeft: 20}}
                routerLink="/database/maintenance"
                routerDirection="none"
            >
                <IonLabel>Perform Maintenance</IonLabel>
            </IonItem>
        </>
    );
};
export default DatabaseMenuItems;