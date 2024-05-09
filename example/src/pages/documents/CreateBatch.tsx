// CreateBatch.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';

import DetailPageDatabaseCollectionRun
  from '../../components/DetailPageDatabaseCollectionRun/DetailPageDatabaseCollectionRun';

import {
  DataGeneratorService,
  ProductType,
} from '../../services/DataGeneratorService';

import {
  IonButton,
} from '@ionic/react';

import {
  MutableDocument,
} from 'cblite';

const CreateBatchPage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [collectionName, setCollectionName] = useState<string>('');
  const [scopeName, setScopeName] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string[]>([]);

  async function update() {
    setResultsMessage([]);
    if (databaseName in databases) {
      const database = databases[databaseName];
      const collection = await database.collection(collectionName, scopeName);
      if (database != null && collection != null) {
        const generator = new DataGeneratorService();
        const products = generator.productDocs;

        //
        // removed inBatch for now until new queue system version is implemented
        //
        //await db.inBatch(() => {
        for (const key in products) {
          const docKey = Number(key);
          const product = products[docKey];

          const document = getDocumentFromProduct(product);
          if (document != null) {
            try {
              await collection.save(document)
              const newDoc = await collection.document(product.id);
              if (product.id == newDoc.getId()) {
                setResultsMessage(prev => [
                  ...prev,
                  `${new Date().toISOString()} Document Saved: ` + product.id,
                ]);
              } else {
                 setResultsMessage(prev => [
                   ...prev,
                   `${new Date().toISOString()} Error: document not saved ` + product.id,
                   ]);
                }
            } catch (e) {
              setResultsMessage(prev => [
                ...prev,
                `${new Date().toISOString()} Error: saving document ` + e,
              ]);
            }
          } else {
            setResultsMessage([
              `${new Date().toISOString()} Error: Document is null from helper method for productId ` +
                product.id,
            ]);
          }
        }
        //}); --removed inBatch for now until new queue system version is implemented
        setResultsMessage(prev => [...prev, `${new Date().toISOString()} Batch Create Complete`]);

      } else {
        setResultsMessage([`${new Date().toISOString()} Error: Database is null)`]);
      }
    } else {
      setResultsMessage([`${new Date().toISOString()} Error: Database is not setup (defined)`]);
    }
  }

  function getDocumentFromProduct(product: ProductType) {
    const document = new MutableDocument(product.id);
    document.setString('category', product.doc.category);
    document.setString('name', product.doc.name);
    document.setString('id', product.id);
    document.setString('location', product.doc.location);
    document.setString('documentType', product.doc.documentType);
    document.setDate('createdOn', product.doc.createdOn);
    document.setNumber('price', product.doc.price);
    document.setInt('quantity', product.doc.quantity);
    document.setBoolean('isOnSale', product.doc.isOnSale);
    return document;
  }

  //validate documents saved only if there wasn't errors
  async function validateDocuments() {
    if (databaseName in databases) {
      const database = databases[databaseName];
      const collection = await database.collection(collectionName, scopeName);
      if (database != null && collection != null) {
        setResultsMessage([]);
        const queryString = "SELECT * FROM " + collection.scope.name + "." + collection.name + " WHERE documentType = 'product'";
        try {
          const query = database.createQuery(queryString);
          const resultSet = await query.execute();
          //TODO FIX Query Results
          for (const result of resultSet) {
            const doc = result[collection.name];
            const id = doc.id;
            const name = doc.name;
            setResultsMessage(prev => [
              ...prev,
              `${new Date().toISOString()} Document Validated: ${id} ${name}`,
            ]);
          }
        } catch (e) {
          setResultsMessage(prev => [...prev, `${new Date().toISOString()} {error}`]);
        }
      }
    }
  }

  async function deleteProductDocuments() {
    if (databaseName in databases) {
      const database = databases[databaseName];
      const collection = await database.collection(collectionName, scopeName);
      if (database != null && collection != null) {
        setResultsMessage([]);
        try {
          const queryString = "SELECT * FROM " + collection.scope.name + "." + collection.name + " WHERE documentType = 'product'";
          const query = database.createQuery(queryString);
          const resultSet = await query.execute();
          for (const result of resultSet) {
            const doc = result[collection.name];
            const id = doc.id;
            const colDocument = await collection.document(id);
            await collection.deleteDocument(colDocument);
            setResultsMessage(prev => [
                ...prev,
                `${new Date().toISOString()} Deleted document: ${id}` ]);
            }
        } catch (e) {
          setResultsMessage(prev => [...prev, `${new Date().toISOString()} {error}`]);
        }
      } else {
        setResultsMessage(prev => [...prev, `${new Date().toISOString()} Error: Database is null)`]);
      }
    } else {
      setResultsMessage(prev => [...prev, `${new Date().toISOString()} Error: Database is not setup (defined)`]);
    }
  }

  function reset() {
    setDatabaseName('');
    setCollectionName('');
    setScopeName('');
    setResultsMessage([]);
  }

  return (
      <DetailPageDatabaseCollectionRun
          navigationTitle="Create Batch"
          collapseTitle="Create Batch"
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
          <>
            <IonButton
                key="document-batch-divider-right-buttons-validate-button-key"
                onClick={validateDocuments}
                style={{
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  padding: '0px 5px',
                }}
            >
              <i className="fa-solid fa-circle-check"></i>
            </IonButton>
            <IonButton
                key="document-batch-divider-right-buttons-delete-button-key"
                onClick={deleteProductDocuments}
                style={{
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  padding: '0px 0px',
                }}
            >
              <i className="fa-solid fa-trash"></i>
            </IonButton>
          </>}
     >
        <></>
      </DetailPageDatabaseCollectionRun>
  );
};

export default CreateBatchPage;
