// Replicator.tsx
import React, { 
  useState, 
  useContext 
} from 'react';

import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerRun from '../../components/DetailPageContainerRun/DetailPageContainerRun';

import {
  IonButton,
} from '@ionic/react';

const ReplicatorPage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string[]>([]);

  function stop () {

  }

  function start() {

  }

  function update() {

  }

  function reset() {
    setDatabaseName('');
    setResultsMessage([]);
  }

  return (
    <DetailPageContainerRun
    navigationTitle="Replicator"
    collapseTitle="Replicator"
    onReset={reset}
    onAction={start}
    databaseName={databaseName}
    setDatabaseName={setDatabaseName}
    sectionTitle="Replicator"
    titleButtons={
      <IonButton
        key="button-stop-key"
        onClick={stop}
        style={{
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: '0px 2px 0px 25px',
        }}
      >
        <i className="fa-solid fa-stop"></i>
      </IonButton>
    }
    results={resultsMessage}>
    <>
    </>
    </DetailPageContainerRun>
  );
};

export default ReplicatorPage;