// CollectionList.tsx
import React, {useState, useContext} from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerRun from '../../components/DetailPageContainerRun/DetailPageContainerRun';
import {IonInput, IonItem} from "@ionic/react";

const CollectionListPage: React.FC = () => {

    const {databases} = useContext(DatabaseContext)!;
    const [databaseName, setDatabaseName] = useState<string>('');
    const [scopeName, setScopeName] = useState<string>('');
    const [resultsMessage, setResultsMessage] = useState<string[]>([]);

    async function update() {
        setResultsMessage([]);
        if (databaseName in databases) {
            const database = databases[databaseName];
            if (database != null) {
                try {
                    const collections = await database.collections(scopeName);
                    for (const collection of collections) {
                        setResultsMessage(prev => [...prev, collection.name]);
                    }
                } catch (error) {
                    setResultsMessage(['Error: ' + error]);
                }
            } else {
                setResultsMessage(['Error: database not available']);
            }
        } else {
            setResultsMessage(prev => [...prev, 'Error: Database is not setup (defined)']);
        }
    }

    function reset() {
        setDatabaseName('');
        setScopeName('');
        setResultsMessage([]);
    }

    return (
        <DetailPageContainerRun
            navigationTitle="List Collections"
            collapseTitle="List Collections"
            onReset={reset}
            onAction={update}
            databaseName={databaseName}
            setDatabaseName={setDatabaseName}
            sectionTitle="Collection"
            titleButtons={undefined}
            results={resultsMessage}>
            <IonItem key="scope-item-key">
                <IonInput
                    key="scope-input-key"
                    onInput={(e: any) => setScopeName(e.target.value)}
                    placeholder="Scope Name"
                    value={scopeName}
                ></IonInput>
            </IonItem>
        </DetailPageContainerRun>
    );
};
export default CollectionListPage;