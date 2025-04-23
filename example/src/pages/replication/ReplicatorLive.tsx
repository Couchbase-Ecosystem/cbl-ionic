// Replicator.tsx
import React, {
  useState,
  useContext,
  useEffect
} from 'react';

import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerRun from '../../components/DetailPageContainerRun/DetailPageContainerRun';

import {
  IonButton,
  IonItem,
  IonLabel,
  IonAccordion,
  IonAccordionGroup,
  IonList
} from '@ionic/react';
import ReplicatorContext from '../../providers/ReplicatorContext';
import { MutableDocument, ReplicatorActivityLevel } from 'cblite-js';

const ReplicatorLivePage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const { replicator, replicatorConfig, setReplicator, setReplicatorConfig } = useContext(ReplicatorContext);
  const [databaseName, setDatabaseName] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string[]>([]);
  const [replicatorStatus, setReplicatorStatus] = useState<string>('Idle');

  useEffect(() => {
    if (!replicator) return;

    let token: string | null = null;

    const setupReplicatorListener = async () => {
      token = await replicator.addChangeListener((change) => {
        const status = change.status;
        const activity = status.getActivityLevel();
        const progress = status.getProgress();
        const error = status.getError();

        const activityLevel = ReplicatorActivityLevel[activity];
        setReplicatorStatus(activityLevel);

        const newMessage = `Status: ${activityLevel} | Completed: ${progress.getCompleted()} / ${progress.getTotal()}`;
        setResultsMessage((prev) => [...prev, newMessage]);

        if (error) {
          setResultsMessage((prev) => [...prev, `Error: ${error}`]);
        }
      });
    };

    setupReplicatorListener();

    return () => {
      if (token) {
        console.log('Removing replicator listener');
        replicator.removeChangeListener(token);
      }
    };
  }, [!!replicator]);

  function stop() {
    if (replicator) {
      replicator.stop();
      setResultsMessage((prev) => [...prev, 'Replicator stopped']);
    }

  }

  function start() {
    if (databaseName === '') {
      setResultsMessage((prev) => [...prev, 'Please select a database']);
      return;
    }

    const database = databases[databaseName];
    if (!database) {
      setResultsMessage((prev) => [...prev, 'Database not found']);
      return;
    }

    if (replicator) {
      replicator.start(false);
      setResultsMessage((prev) => [...prev, 'Replicator started']);
    } else {
      setResultsMessage((prev) => [...prev, 'Replicator not initialized']);
    }

  }

  async function createTestDocument() {
    if (!databaseName || !(databaseName in databases)) {
      setResultsMessage(prev => [...prev, 'Error: Database is not setup']);
      return;
    }

    const db = databases[databaseName];
    const collection = await db.defaultCollection();

    const id = 'doc_' + Date.now();
    const doc = new MutableDocument(id, {
      name: `Document ${id}`,
      description: "This is a test document created locally.",
      timestamp: new Date().toISOString(),
    });

    await collection.save(doc);
    setResultsMessage(prev => [
      ...prev,
      `📄 Local document created:\n${doc.toJsonString()}`
    ]);
  }
  function reset() {
    setDatabaseName('');
    setResultsMessage([]);
    setReplicator(null);
    setReplicatorConfig(null);
    setReplicatorStatus('Idle');
  }

  return (
    <DetailPageContainerRun
      navigationTitle="Replicator Live"
      collapseTitle="Replicator Live"
      onReset={reset}
      onAction={start}
      databaseName={databaseName}
      setDatabaseName={setDatabaseName}
      sectionTitle="Replicator Live"
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
        <IonButton expand="full" onClick={createTestDocument} className="m-1">
          Create Test Document
        </IonButton>
        <IonItem>
          <IonLabel>Replicator Status: {replicatorStatus}</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            <h3>Configuration:</h3>
            <IonAccordionGroup>
              <IonAccordion value="config">
                <IonItem slot="header">
                  <IonLabel>View Configuration</IonLabel>
                </IonItem>
                <IonList slot="content">
                  {Object.entries(replicatorConfig || {}).map(([key, value]) => (
                    <IonItem key={key}>
                      <IonLabel>
                        {key}: {typeof value === 'object' ? JSON.stringify(value) : `${value}`}
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </IonAccordion>
            </IonAccordionGroup>
          </IonLabel>
        </IonItem>
      </>
    </DetailPageContainerRun>
  );
};

export default ReplicatorLivePage;