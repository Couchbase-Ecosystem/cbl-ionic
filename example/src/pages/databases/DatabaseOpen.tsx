// DatabaseOpen.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageDatabaseContainerRun from '../../components/DetailPageDatabaseContainerRun/DetailPageDatabaseContainerRun';

//import the database in order to create/open a database

const DatabaseOpenPage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string[]>([]);

  function reset() {
    setDatabaseName('');
    setResultsMessage([]);
  }

  async function update() {
    if (databaseName in databases) {
      const database = databases[databaseName];
      if (database != null) {
        try {
        await database.open()
        setResultsMessage(prev => [...prev, 'success']);
        } catch (error) {
            setResultsMessage(prev => [...prev, '' + error]);
        }
      }
    } else {
      setResultsMessage(prev => [...prev, 'Error: Database not found']);
    }
  }
  return (
      <DetailPageDatabaseContainerRun
          navigationTitle="Database Open"
          collapseTitle="Database Open"
          titleButtons={undefined}
          onReset={reset}
          onAction={update}
          databaseName={databaseName}
          setDatabaseName={setDatabaseName}
          results={resultsMessage}>
      </DetailPageDatabaseContainerRun>
  );
};

export default DatabaseOpenPage;
