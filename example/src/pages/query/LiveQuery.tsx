// LiveQuery.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';

import { IonItemDivider, IonLabel } from '@ionic/react';

const LiveQueryPage: React.FC = () => {

  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');

  function update() {

  }

  function reset() {

  }

  return (
    <DetailPageContainer 
      navigationTitle="Live Query" collapseTitle="Live Query"
      onReset={reset}
      onAction={update}
      resultsMessage={resultsMessage}
      actionLabel="Listen">
      <DatabaseNameForm
        setDatabaseName={setDatabaseName}
        databaseName={databaseName}  />
      <IonItemDivider>
        <IonLabel>Live Query</IonLabel>
      </IonItemDivider>
    </DetailPageContainer>
  );
};

export default LiveQueryPage;