// CollectionChange.tsx
import React, { useState, useContext } from 'react';

import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerRun from '../../components/DetailPageContainerRun/DetailPageContainerRun';

import { MutableDocument, Collection } from 'cbl-ionic';

import {IonInput, IonItem} from '@ionic/react';

const CollectionChangePage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
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
      if (!!database) {
        const collection = await database.collection(collectionName, scopeName);
        if (collection != null) {
          setCollection(collection);
          if(!isListenerAdded || token ==='') {
            const token = await collection.addChangeListener(change => {
              for (const doc of change.documentIDs) {
                const dateString = new Date().toISOString();
                setResultsMessages(prev => [...prev, `${dateString} Collection Change: ${doc}`]);
              }
            });
            setIsListenerAdded(true);
            setToken(token);
          }
          const saveDocuments = async () => {
            const doc1 = new MutableDocument();
            const doc2 = new MutableDocument();
            doc1.setId('doc1');
            doc1.setString('name', 'Alice');
            doc2.setId('doc2');
            doc2.setString('name', 'tdbGamer');
            await collection.save(doc1);
            await collection.save(doc2);
          };
          await saveDocuments();
        } else {
          setResultsMessages(prev => [...prev, `Collection ${scopeName}.${collectionName} not found`])
        }
      } else {
        setResultsMessages(prev => [...prev, `Database ${databaseName} not found`])
      }
    } catch (error) {
      setResultsMessages([error.message]);
    }
  }

  async function reset() {
    const database = databases[databaseName];
    if (database != null && isListenerAdded) {
      await collection.removeChangeListener(token);
      setIsListenerAdded(false);
      setResultsMessages([
        `Removed Listening for changes on collection: ${collection.name}`,
      ]);
    }
    setToken('');
    setDatabaseName('');
    setCollectionName('');
    setScopeName('');
  }

  return (
    <DetailPageContainerRun
      navigationTitle="Collection Change"
      collapseTitle="Collection Change"
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

export default CollectionChangePage;
