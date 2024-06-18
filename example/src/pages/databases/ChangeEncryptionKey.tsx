// DatabaseOpen.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerRun from '../../components/DetailPageContainerRun/DetailPageContainerRun';
import {IonInput, IonItem} from "@ionic/react";

//import the database in order to create/open a database

const ChangeEncryptionKeyPage: React.FC = () => {
    const { databases } = useContext(DatabaseContext)!;
    const [databaseName, setDatabaseName] = useState<string>('');
    const [newKey, setNewKey] = useState<string>('');
    const [resultsMessage, setResultsMessage] = useState<string[]>([]);

    function reset() {
        setNewKey('');
        setDatabaseName('');
        setResultsMessage([]);
    }

    async function update() {
        if (databaseName in databases) {
            const database = databases[databaseName];
            if (database != null) {
                try {
                    await database.changeEncryptionKey(newKey);
                    setResultsMessage(prev => [...prev, 'success']);
                } catch (error) {
                    setResultsMessage(prev => [...prev, '' + error]);
                }
            }
        } else {
            setResultsMessage(prev => [...prev, 'Error: Database not found']);
        }
    }
    return (
        <DetailPageContainerRun
            navigationTitle="Change Encryption Key"
            collapseTitle="Change Encryption Key"
            titleButtons={undefined}
            onReset={reset}
            onAction={update}
            databaseName={databaseName}
            setDatabaseName={setDatabaseName}
            results={resultsMessage}
            sectionTitle="Encryption Key">
            <IonItem key="new-encryption-key-item-key">
                <IonInput
                    key="new-encryption-key-input-key"
                    onInput={(e: any) => setNewKey(e.target.value)}
                    placeholder="New Encryption Key"
                    value={newKey}
                ></IonInput>
            </IonItem>
        </DetailPageContainerRun>
    );
};

export default ChangeEncryptionKeyPage;
