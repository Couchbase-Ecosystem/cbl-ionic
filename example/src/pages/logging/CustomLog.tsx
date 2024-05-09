// CustomLog.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';

import { IonItemDivider, IonLabel } from '@ionic/react';

const CustomLogPage: React.FC = () => {

  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');

  function update () {

  }

  function reset () {

  }


  return (
    <DetailPageContainer 
    navigationTitle="Custom Log" collapseTitle="Custom Log"
    onReset={reset}
    onAction={update}
    resultsMessage={resultsMessage}
    actionLabel="Set">
      <DatabaseNameForm
        setDatabaseName={setDatabaseName}
        databaseName={databaseName}  />
      <IonItemDivider>
        <IonLabel>Logger</IonLabel>
      </IonItemDivider>
    </DetailPageContainer>
  );
};

export default CustomLogPage;