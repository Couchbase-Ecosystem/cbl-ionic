// CollectionCreate.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerRun from '../../components/DetailPageContainerRun/DetailPageContainerRun';
import {IonInput, IonItem} from "@ionic/react";

const CollectionCreatePage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
    const [scopeName, setScopeName] = useState<string>('');
    const [collectionName, setCollectionName] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string[]>([]);

  async function update() {
    if (databaseName in databases) {
      const database = databases[databaseName];
      if (database != null) {
       try {
           const collection = await database.createCollection(collectionName, scopeName);
           if (collection != null &&
               collection.name == collectionName &&
               collection.scope.name == scopeName){
               setResultsMessage(['Collection created: ' + collection.name]);
           }
       } catch(error) {
           setResultsMessage(['Error: ' + error]);
       }
      }else {
           setResultsMessage(['Error: database not available']);
      }
    } else {
      setResultsMessage(prev => [...prev, 'Error: Database is not setup (defined)']);
    }
  }

  function reset() {
    setDatabaseName('');
    setScopeName('');
    setCollectionName('');
    setResultsMessage([]);
  }

  return (
      <DetailPageContainerRun
          navigationTitle="Create Collection"
          collapseTitle="Create Collection"
          onReset={reset}
          onAction={update}
          databaseName={databaseName}
          setDatabaseName={setDatabaseName}
          sectionTitle="Collection"
          titleButtons={undefined}
          results={resultsMessage} >
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

export default CollectionCreatePage;