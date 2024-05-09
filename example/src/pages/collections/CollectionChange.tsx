// CollectionChange.tsx
import React, { useState, useContext, useEffect } from 'react';

import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerRun from '../../components/DetailPageContainerRun/DetailPageContainerRun';

import { MutableDocument } from 'cblite';
import { DatabaseChangeListeners } from 'cbl-ionic';

import {IonInput, IonItem} from '@ionic/react';

const CollectionChangePage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [scopeName, setScopeName] = useState<string>('');
  const [collectionName, setCollectionName] = useState<string>('');
  const [resultsMessages, setResultsMessages] = useState<string[]>([]);
  const [changeListeners, setChangeListeners] =
    useState<DatabaseChangeListeners | null>(null);
  const [isListenerAdded, setIsListenerAdded] = useState(false);

  useEffect(() => {
    if (changeListeners) {
      setResultsMessages(prev => [
        ...prev,
        'adding change listener',
      ]);
      const addListener = async () => {
          await changeListeners.addChangeListener(change => {
          setResultsMessages(prev => [
            ...prev,
            `Database Change: ${change.documentIds.join(', ')}`,
          ]);
        });
        setIsListenerAdded(true);
        setResultsMessages(prev => [
          ...prev,
          'set listener token',
        ]);
      };
      addListener();
    }
  }, [changeListeners]);

  useEffect(() => {
    if (isListenerAdded) {
      try {
        const database = databases[databaseName];
        setResultsMessages(prev => [
          ...prev,
          `Listening for changes on database: ${databaseName}`,
        ]);

        const saveDocuments = async () => {
          const doc1 = new MutableDocument();
          const doc2 = new MutableDocument();
          doc1.setId('doc1');
          doc1.setString('name', 'Alice');
          doc2.setId('doc2');
          doc2.setString('name', 'tdbgamer');
          await database.save(doc1);
          await database.save(doc2);
        };
        saveDocuments();
      } catch (error) {
        setResultsMessages(error.message);
      }
    }
  }, [isListenerAdded]);

  async function update() {
    try {
      const database = databases[databaseName];
      if (database != null) {
        const cl = new DatabaseChangeListeners(database);
        setChangeListeners(cl);
        /*
        let token = await changeListeners.addChangeListener(change => {
          setResultsMessages(prev => [...prev, 
            `Database Change: ${change.documentIDs.join(', ')}`]
          );
        });
        setListenerToken(token);
        */
      }
    } catch (error) {
      setResultsMessages(error.message);
    }
  }

  function reset() {
    const database = databases[databaseName];
    if (database != null && isListenerAdded) {
      setChangeListeners(null);
      setIsListenerAdded(false);
      setResultsMessages([
        `Removed Listening for changes on database: ${databaseName}`,
      ]);
    }
    setDatabaseName('');
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
