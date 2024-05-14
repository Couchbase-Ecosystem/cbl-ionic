// ChangeDocument.tsx
import React, {useState, useContext} from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerRun from '../../components/DetailPageContainerRun/DetailPageContainerRun';
import {MutableDocument, Collection} from 'cblite';
import {IonInput, IonItem} from '@ionic/react';

const ChangeDocumentPage: React.FC = () => {
    const {databases} = useContext(DatabaseContext)!;
    const [databaseName, setDatabaseName] = useState<string>('');
    const [scopeName, setScopeName] = useState<string>('');
    const [collectionName, setCollectionName] = useState<string>('');
    const [collection, setCollection] = useState<Collection>(null);
    const [resultsMessages, setResultsMessages] = useState<string[]>([]);
    const [isListenerAdded, setIsListenerAdded] = useState(false);
    const [token, setToken] = useState<string>('');

    async function update() {
        try {
            const database = databases[databaseName];
            if (database !== null) {
                const collection = await database.collection(collectionName, scopeName);
                if (collection != null) {
                    setCollection(collection);
                    const docId = 'doc1';
                    if (!isListenerAdded || token === '') {
                        const token = await collection.addDocumentChangeListener(docId, change => {
                            const dateString = new Date().toISOString();
                            setResultsMessages(prev => [...prev, `${dateString} Document Changed: ${change.documentId} in ${collection.scope.name} ${collection.name} in ${database.getName()}`]);
                        });
                        setIsListenerAdded(true);
                        setToken(token);
                    }
                    const doc1 = new MutableDocument();
                    doc1.setId('doc1');
                    doc1.setString('name', 'Alice');
                    await collection.save(doc1);
                    doc1.setString('name', 'Bob');
                    await collection.save(doc1);
                } else {
                    setResultsMessages(prev => [...prev, `Collection ${scopeName}.${collectionName} not found`])
                }
            } else {
                setResultsMessages(prev => [...prev, `Database ${databaseName} not found`])
            }
        } catch (error) {
            setResultsMessages(prev => [...prev, `${new Date().toISOString()} ${error.message}`]);
        }
    }

    async function reset() {
        const database = databases[databaseName];
        if (database != null && isListenerAdded) {
            await collection.removeDocumentChangeListener(token);
            setIsListenerAdded(false);
            setResultsMessages([
                `Removed Listening for document changes on collection: ${collection.name}`,
            ]);
        }
        setToken('');
        setDatabaseName('');
        setCollectionName('');
        setScopeName('');
    }

    return (
        <DetailPageContainerRun
            navigationTitle="Document Change"
            collapseTitle="Document Change"
            onReset={reset}
            onAction={update}
            databaseName={databaseName}
            setDatabaseName={setDatabaseName}
            sectionTitle="Collection"
            titleButtons={undefined}
            results={resultsMessages}>
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
        </DetailPageContainerRun>
    );
};

export default ChangeDocumentPage;
