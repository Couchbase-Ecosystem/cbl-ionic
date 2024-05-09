// DocumentIdForm.tsx
import React from 'react';

import {
    IonButton,
    IonItemGroup,
    IonItemDivider,
    IonList,
    IonItem,
    IonInput,
    IonLabel,
} from '@ionic/react';

export type DocumentIdFormType = {
    setDatabaseName: (arg: string) => void;
    databaseName: string;
    setDocumentId: (arg: string) => void;
    documentId: string;
};

const DocumentIdForm: React.FC<DocumentIdFormType> =
    ({
         setDatabaseName,
         databaseName,
         setDocumentId,
         documentId,
     }) => {
        return (
            <IonList>
                <IonItemDivider>
                    <IonLabel>Database</IonLabel>
                </IonItemDivider>
                <IonItem key={0}>
                    <IonInput
                        onInput={(e: any) => setDatabaseName(e.target.value)}
                        placeholder="Database Name"
                        value={databaseName}
                    ></IonInput>
                </IonItem>
                <IonItemDivider>
                    <IonLabel>Document Information</IonLabel>
                </IonItemDivider>
                <IonItem key={1}>
                    <IonInput
                        onInput={(e: any) => setDocumentId(e.target.value)}
                        placeholder="Document ID"
                        value={documentId}
                    ></IonInput>
                </IonItem>
            </IonList>
        );
    };

export default DocumentIdForm;
