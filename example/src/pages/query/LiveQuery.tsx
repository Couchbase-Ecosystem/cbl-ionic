// LiveQuery.tsx
import './LiveQuery.css';
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageDatabaseCollectionRun from '../../components/DetailPageDatabaseCollectionRun/DetailPageDatabaseCollectionRun';
import { MutableDocument, Query } from 'cbl-ionic';
import { IonItemDivider, IonLabel, IonButton } from '@ionic/react';

const LiveQueryPage: React.FC = () => {
    const { databases } = useContext(DatabaseContext)!;
    const [databaseName, setDatabaseName] = useState<string>('');
    const [scopeName, setScopeName] = useState<string>('');
    const [collectionName, setCollectionName] = useState<string>('');
    const [resultsMessage, setResultsMessage] = useState<string[]>([]);
    const [query, setQuery] = useState<Query>(null);
    const [isListenerAdded, setIsListenerAdded] = useState(false);
    const [token, setToken] = useState<string>('');

    async function addListener() {
        let collection = null;
        if (!(databaseName in databases)) {
            setResultsMessage(["Error: Database is not set up"]);
            return;
        }

        const database = databases[databaseName];
        if (!collectionName || !scopeName) {
            setResultsMessage(["Error: Collection or scope name is empty"]);
            return;
        }

        try {
            collection = await database.collection(collectionName, scopeName);
        } catch (error) {
            setResultsMessage([`Error getting collection: ${error.message}`]);
            return;
        }

        if (!collection) {
            setResultsMessage(["Error: Database or collection is null"]);
            return;
        }

        if (isListenerAdded && token !== '') {
            setResultsMessage(["Listener already added."]);
            return;
        }

        try {
            const queryString = `SELECT * FROM ${scopeName}.${collectionName} WHERE type = 'live-query-example'`;
            const query = database.createQuery(queryString);

            const listenerToken = await query.addChangeListener((change) => {
                if (change.error) {
                    setResultsMessage([`Error in Change Listener: ${change.error}`]);
                    return;
                }

                if (change.results.length > 0) {
                    const results = change.results.map((doc) => JSON.stringify(doc));
                    setResultsMessage((prev) => [...prev, ...results]);
                } else {
                    setResultsMessage(["No data in results"]);
                }

            });

            setIsListenerAdded(true);
            setQuery(query);
            setToken(listenerToken);
            setResultsMessage(["Listener added successfully."]);
        } catch (error) {
            setResultsMessage([`Error adding listener: ${error.message}`]);
            return;
        }
    }

    async function addDocument() {
        setResultsMessage([])
        if (!(databaseName in databases)) {
            setResultsMessage(["Error: Database is not set up"]);
            return;
        }

        const database = databases[databaseName];
        const collection = await database.collection(collectionName, scopeName);

        if (!collection) {
            setResultsMessage(["Error: Database or collection is null"]);
            return;
        }

        const id = Math.floor(Math.random() * 1000).toString();
        const doc = new MutableDocument(`doc-${id}`);
        doc.setString('counter', id);
        doc.setString('type', 'live-query-example');
        await collection.save(doc);
        setResultsMessage((prev) => [...prev, `Document ${doc.getId()} added.`]);
    }

    async function reset() {
        if (query && isListenerAdded) {
            await query.removeChangeListener(token);
            setIsListenerAdded(false);
            setResultsMessage(["Listener removed successfully."]);
        }

        setCollectionName('');
        setScopeName('');
        setDatabaseName('');
        setResultsMessage([]);
        setToken('');
        setQuery(null);
    }

    return (
        <DetailPageDatabaseCollectionRun
            navigationTitle="Live Query"
            collapseTitle="Live Query"
            onAction={addListener}
            onReset={reset}
            results={resultsMessage}
            databaseName={databaseName}
            setDatabaseName={setDatabaseName}
            sectionTitle={`Live Query - ${isListenerAdded ? "Listener Added" : "Step 1: Add Listener"}`}
            collectionName={collectionName}
            setCollectionName={setCollectionName}
            scopeName={scopeName}
            setScopeName={setScopeName}
            titleButtons={undefined}
        >
            <IonItemDivider>
                <IonLabel>Step 2: Add Document</IonLabel>
            </IonItemDivider>
            <IonButton
                onClick={addDocument}
                style={{
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    padding: '10px 20px',
                }}
            >
                Add Document
            </IonButton>
        </DetailPageDatabaseCollectionRun>
    );
};

export default LiveQueryPage;