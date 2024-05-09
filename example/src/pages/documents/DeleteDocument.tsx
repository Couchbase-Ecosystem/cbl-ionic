// DeleteDocument.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageDatabaseCollectionRun
  from '../../components/DetailPageDatabaseCollectionRun/DetailPageDatabaseCollectionRun';
import {IonInput, IonItem} from "@ionic/react";

const DeleteDocumentPage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [collectionName, setCollectionName] = useState<string>('');
  const [scopeName, setScopeName] = useState<string>('');
  const [documentId, setDocumentId] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string[]>([]);

  function reset() {
    setDatabaseName('');
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
          const doc = await collection.document(documentId);
          if (doc !== null && doc.getId() !== null) {
            await collection.deleteDocument(doc);
            setResultsMessage(prev => [...prev, `${new Date().toISOString()} success`]);
          } else {
            setResultsMessage(prev => [...prev, `${new Date().toISOString()} Error: Document not found`]);
          }
        } catch (error) {
          setResultsMessage(prev => [...prev, `${new Date().toISOString()} {error}`]);
        }
      } else {
        setResultsMessage(prev => [...prev, `${new Date().toISOString()} Error: Database is not setup (defined)`]);
      }
    }
  }

  return (
    <DetailPageDatabaseCollectionRun
      navigationTitle="Delete Document"
      collapseTitle="Delete Document"
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
    </DetailPageDatabaseCollectionRun>
  );
};

export default DeleteDocumentPage;
