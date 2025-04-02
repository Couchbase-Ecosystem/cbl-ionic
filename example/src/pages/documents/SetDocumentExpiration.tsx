// GetDocument.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageDatabaseCollectionRun
  from '../../components/DetailPageDatabaseCollectionRun/DetailPageDatabaseCollectionRun';
import {IonInput, IonItem} from "@ionic/react";

const SetDocumentExpirationPage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [collectionName, setCollectionName] = useState<string>('');
  const [scopeName, setScopeName] = useState<string>('');
  const [documentId, setDocumentId] = useState<string>('');
  const [expiration, setExpiration] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string[]>([]);


  function reset() {
    setDatabaseName('');
    setExpiration('');
    setScopeName('');
    setCollectionName('');
    setDocumentId('');
    setResultsMessage([]);
  }

  async function update() {
    if (databaseName in databases) {
      const database = databases[databaseName];
      const collection = await database.collection(collectionName, scopeName);
      if (database != null && collection != null) {
        try {
          const expirationDate = new Date(expiration);
          const doc = await collection.document(documentId);
          if (doc !== null && doc.getId() != null) {
            const fields = doc.toDictionary();
            const fieldsMessage = Object.entries(fields)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ');

              setResultsMessage(prev => [
                ...prev,
                `${new Date()} Document Found: ${fieldsMessage}`,
              ]);
            await collection.setDocumentExpiration(documentId, expirationDate);
            setResultsMessage(prev => [...prev, `${new Date()} Document Expiration Set`]);
          } else {
            setResultsMessage(prev => [...prev, `${new Date()} Error: Document not found`]);
          }
        } catch (error) {
          setResultsMessage(prev => [...prev, error.message]);
        }
      } else {
        setResultsMessage(prev => [...prev, `${new Date()} Error: Database is not setup (defined)`]);
      }
    }
  }

  return (
    <DetailPageDatabaseCollectionRun
    navigationTitle="Set Expiration" 
    collapseTitle="Set Expiration"
    onReset={reset}
    onAction={update}
    results={resultsMessage}
    databaseName={databaseName}
    setDatabaseName={setDatabaseName}
    scopeName={scopeName}
    setScopeName={setScopeName}
    collectionName={collectionName}
    setCollectionName={setCollectionName}
    sectionTitle="Document Information"
    titleButtons={undefined}>
      <IonItem key="doc-id-item">
        <IonInput
            key="doc-id-input"
            onInput={(e: any) => setDocumentId(e.target.value)}
            placeholder="Document ID"
            value={documentId}
        ></IonInput>
      </IonItem>

      <IonItem key="doc-expiration-item">
        <IonInput
            key="doc-expiration-input"
            onInput={(e: any) => setExpiration(e.target.value)}
            placeholder="Expiration in ISO8601 Format"
            value={expiration}
        ></IonInput>
      </IonItem>

    </DetailPageDatabaseCollectionRun>
  );
};

export default SetDocumentExpirationPage;