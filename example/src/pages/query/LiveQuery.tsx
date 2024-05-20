// LiveQuery.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageDatabaseCollectionRun from '../../components/DetailPageDatabaseCollectionRun/DetailPageDatabaseCollectionRun';
import { MutableDocument, Query} from 'cblite';

const LiveQueryPage: React.FC = () => {

  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string[]>([]);
  const [query, setQuery] = useState<Query>(null);
  const [scopeName, setScopeName] = useState<string>('');
  const [collectionName, setCollectionName] = useState<string>('');
  const [isListenerAdded, setIsListenerAdded] = useState(false);
  const [token, setToken] = useState<string>('');

  async function update() {
      if (databaseName in databases) {
          const database = databases[databaseName];
          const collection = await database.collection(collectionName, scopeName);
          if (collection != null){
              try {
                  const queryString = `SELECT * FROM ${scopeName}.${collectionName} AS testCollection`;
                  const query = database.createQuery(queryString);
                  const token = await query.addChangeListener((change) => {
                    if (change.error !== null && change.error.length > 0) {
                        setResultsMessage([`${new Date().toISOString()} Error in Change Listener: ${change.error}`]);
                    } else {
                        for (const doc of change.results) {
                            setResultsMessage(prev => [...prev, `${new Date().toISOString()} : ${doc['testCollection']}`]);
                        }
                    }
                  });
                  setQuery(query);
                  setToken(token);
                  //change documents
                  for(let count = 0; count < 5; count++) {
                      const doc = new MutableDocument(`doc${count}`);
                      doc.setString('counter', count.toString());
                      await collection.save(doc);
                  }

              } catch(e) {
                  setResultsMessage([`${new Date().toISOString()} Error: ${e}`]);
              }
          }  else {
              setResultsMessage([`${new Date().toISOString()} Error: Database or collection is null)`]);
          }
      } else {
          setResultsMessage([`${new Date().toISOString()} Error: Database is not setup (defined)`]);
      }

  }

  async function reset() {
    const database = databases[databaseName];

      if (database != null && isListenerAdded) {
        await query.removeChangeListener(token);
        setIsListenerAdded(false);
        setResultsMessage([
            `Removed Listening for query changes`,
        ]);
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
          navigationTitle="Query SQL++"
          collapseTitle="Query SQL++"
          onReset={reset}
          onAction={update}
          results={resultsMessage}
          databaseName={databaseName}
          setDatabaseName={setDatabaseName}
          sectionTitle="Query"
          collectionName={collectionName}
          setCollectionName={setCollectionName}
          scopeName={scopeName}
          setScopeName={setScopeName}
          titleButtons={ undefined }>
      <></>
      </DetailPageDatabaseCollectionRun>
  );
};

export default LiveQueryPage;