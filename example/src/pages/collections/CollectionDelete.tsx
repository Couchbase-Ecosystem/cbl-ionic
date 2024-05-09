// CollectionDelete.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerRun from "../../components/DetailPageContainerRun/DetailPageContainerRun";
import {IonInput, IonItem} from "@ionic/react";

const CollectionDeletePage: React.FC = () => {
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
                    await database.deleteCollection(collectionName, scopeName);
                    setResultsMessage(['Collection deleted: ' + collectionName]);
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
          navigationTitle="Delete Collection"
          collapseTitle="Delete Collection"
          onReset={reset}
          onAction={update}
          databaseName={databaseName}
          setDatabaseName={setDatabaseName}
          sectionTitle="Collection"
          titleButtons={<></>}
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

export default CollectionDeletePage;