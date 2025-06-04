// GetDocument.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageDatabaseCollectionRun
  from '../../components/DetailPageDatabaseCollectionRun/DetailPageDatabaseCollectionRun';
import {IonInput, IonItem, IonButton} from "@ionic/react";

const GetDocumentPage: React.FC = () => {
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
          if (doc !== undefined && doc !== null && doc.getId() != null) {
            const docData = doc.toDictionary();
            setResultsMessage(prev => [...prev, `${new Date()} Document Found: ` + JSON.stringify(docData)]);
            if (doc['textBlob'] !== null){
              const blob =  await doc.getBlob('textBlob');
              const blobText = blob.getBytes();
               if (blobText !== null) {
                  const textDecoder = new TextDecoder();
                  const textBlobResults = textDecoder.decode(blobText);
                  setResultsMessage(prev => [...prev, textBlobResults]);

               }
            }
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

  async function getDocumentExpiration() {
    try {
    if (databaseName in databases) {
      const database = databases[databaseName];
      const collection = await database.collection(collectionName, scopeName);
      if (database != null && collection != null) {
          const date = await collection.getDocumentExpiration(documentId);
          if (date !== null) {
            setResultsMessage(prev => [...prev, `Document Expiration: ${date}`]);
          } else {
            setResultsMessage(prev => [...prev, `Document Expiration not set - came back null`]);
          }
        }
      }
    }
    catch (error) {
    setResultsMessage(prev => [...prev, error.message]);
  }
}

  return (
    <DetailPageDatabaseCollectionRun
    navigationTitle="Get Document" 
    collapseTitle="Get Document"
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
    titleButtons={
      <IonButton
      key="document-batch-divider-right-buttons-expiration-button-key"
      onClick={getDocumentExpiration}
      style={{
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: '0px 0px',
      }}>
      <i className="fa-solid fa-clock"></i>
      </IonButton>
    }>
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


export default GetDocumentPage;