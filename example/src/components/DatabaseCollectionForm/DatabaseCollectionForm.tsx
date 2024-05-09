/* eslint-disable no-unused-vars */
import React from 'react';
import {
    IonItem,
    IonInput,
    IonItemDivider,
    IonItemGroup,
    IonLabel
} from '@ionic/react';

export type ContainerProps = {
    setDatabaseName: (arg: string) => void;
    databaseName: string;
    setScopeName: (arg: string) => void;
    scopeName: string;
    setCollectionName: (arg: string) => void;
    collectionName: string;
};

const DatabaseCollectionForm: React.FC<ContainerProps> =
    ({
         setDatabaseName,
         databaseName,
         setScopeName,
         scopeName,
         setCollectionName,
         collectionName
     }) => {
        return (
            <IonItemGroup key="item-group-database-key">
                <IonItemDivider key="database-divider-key">
                    <IonLabel key="database-label-key">Database</IonLabel>
                </IonItemDivider>
                <IonItem key="database-item-key">
                    <IonInput
                        key="database-input-key"
                        onInput={(e: any) => setDatabaseName(e.target.value)}
                        placeholder="Database Name"
                        value={databaseName}
                    ></IonInput>
                </IonItem>
                <IonItemDivider key="collection-divider-key">
                    <IonLabel key="collection-label-key">Collection</IonLabel>
                </IonItemDivider>
                <IonItem key="scope-item-key">
                    <IonInput
                        key="scope-input-key"
                        onInput={(e: any) => setScopeName(e.target.value)}
                        placeholder="Scope Name"
                        value={scopeName}
                    ></IonInput>
                </IonItem>
                <IonItem key="collection-item-key">
                    <IonInput
                        key="collection-input-key"
                        onInput={(e: any) => setCollectionName(e.target.value)}
                        placeholder="Collection Name"
                        value={collectionName}
                    ></IonInput>
                </IonItem>
            </IonItemGroup>
        );
    };

export default DatabaseCollectionForm;