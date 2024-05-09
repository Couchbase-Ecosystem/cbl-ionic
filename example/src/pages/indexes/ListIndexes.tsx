// ListIndexes.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';

import { IonItemDivider, IonLabel, IonItem } from '@ionic/react';

const ListIndexesPage: React.FC = () => {

  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');
  const [indexes, setIndexes] = useState<string[]>([]);

  function update () {
    if (databaseName in databases) {
      let db = databases[databaseName];
      if (db != null) {
        db.getIndexes()
          .then((indexes) => {
            setIndexes(indexes);
            if (indexes.length === 0) {
              setResultsMessage('success - no indexes found');
            } else {
              setResultsMessage('success');
            }
          })
          .catch((error: unknown) => {
            setResultsMessage('' + error);
          });
      }
    } else {
      setResultsMessage('Error: Database is not setup (defined)');
    } 
  }

  function reset () 
  {
    setDatabaseName('');
    setResultsMessage('');
    setIndexes([]);
  }

  return (
    <DetailPageContainer 
    navigationTitle="List Indexes" collapseTitle="List Indexes"
    onReset={reset}
    onAction={update}
    resultsMessage={resultsMessage}
    actionLabel="Get">
      <DatabaseNameForm
        setDatabaseName={setDatabaseName}
        databaseName={databaseName}  />
        <IonItemDivider>
        <IonLabel>Indexes</IonLabel>
      </IonItemDivider>
      {indexes.map((index, indexIndex) => {
        return (
          <IonItem key={indexIndex}>
            <IonLabel>{index}</IonLabel>
          </IonItem>
        );
      })}
    </DetailPageContainer>
  );
};

export default ListIndexesPage;