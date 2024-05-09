// DeleteIndex.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';

import { IonItemDivider, IonLabel, IonInput, IonItem } from '@ionic/react';

const DeleteIndexPage: React.FC = () => {

  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');
  const [indexName, setIndexName] = useState<string>('');

  function update () {
    if (databaseName in databases) {
      let db = databases[databaseName];
      if (db != null) {
        if (indexName.length > 0) {
        db.deleteIndex(indexName)
          .then(() => {
            setResultsMessage('success');
          })
          .catch((error: unknown) => {
            setResultsMessage('' + error);
          });
        } else {
          setResultsMessage('Error: Index name is not defined');
        }
      }
    } else {
      setResultsMessage('Error: Database is not setup (defined)');
    }
  }

  function reset () {
    setDatabaseName('');
    setIndexName('');
    setResultsMessage('');
  }

  return (
    <DetailPageContainer 
      navigationTitle="Delete Index"     
      collapseTitle="Delete Index"
      onReset={reset}
      onAction={update}
      resultsMessage={resultsMessage}
      actionLabel="Delete">
      <DatabaseNameForm
        setDatabaseName={setDatabaseName}
        databaseName={databaseName}  />
      <IonItemDivider>
        <IonLabel>Index</IonLabel>
      </IonItemDivider>
      <IonItem key={3}>
        <IonInput
          onInput={(e: any) => setIndexName(e.target.value)}
          placeholder="Index Name"
          value={indexName}
        ></IonInput>
      </IonItem>
    </DetailPageContainer>
  );
};


export default DeleteIndexPage;