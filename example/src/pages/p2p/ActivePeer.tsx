import React, { useState, useContext, useEffect } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerRun from '../../components/DetailPageContainerRun/DetailPageContainerRun';
import { IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonToggle, IonAccordion, IonAccordionGroup, IonList } from '@ionic/react';
import { MutableDocument, ReplicatorActivityLevel } from 'cblite-js';
import ReplicatorContext from '../../providers/ReplicatorContext';

const ActivePeerPage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const {
    replicator,
    replicatorConfig,
    setReplicator,
    setReplicatorConfig
  } = useContext(ReplicatorContext)
  const [databaseName, setDatabaseName] = useState<string>('');
  const [scopeName, setScopeName] = useState<string>('_default');
  const [collectionName, setCollectionName] = useState<string>('_default');
  const [url, setUrl] = useState<string>('ws://localhost:4984');
  const [replicationType, setReplicationType] = useState<'push' | 'pull' | 'pushAndPull'>('pushAndPull');
  const [continuous, setContinuous] = useState<boolean>(true);

  const [replicatorStatus, setReplicatorStatus] = useState<string>('Idle');
  const [resultsMessage, setResultsMessage] = useState<string[]>([]);

  useEffect(() => {
    if (!replicator) return;

    let token: string | null = null;

    const setupReplicatorListener = async () => {
      token = await replicator.addChangeListener((change: any) => {
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
        replicator.removeChangeListener(token);
      }
    };
  }, [replicator]);

  function reset() {
    setDatabaseName('');
    setScopeName('_default');
    setCollectionName('_default');
    setUrl('ws://localhost:4984');
    setReplicator(null);
    setReplicatorConfig(null);
    setReplicatorStatus('Idle');
    setResultsMessage([]);
  }

  async function start() {
    if (!databaseName) {
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

  function stop() {
    if (replicator) {
      replicator.stop();
      setResultsMessage((prev) => [...prev, 'Replicator stopped']);
    }
  }

  async function createTestDocument() {
    if (!databaseName || !(databaseName in databases)) {
      setResultsMessage(prev => [...prev, 'Error: Database is not setup']);
      return;
    }
    const db = databases[databaseName];
    const collection = await db.defaultCollection();
    const id = 'doc-1';
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

  return (
    <DetailPageContainerRun
      navigationTitle="Active Peer"
      collapseTitle="Active Peer"
      onReset={reset}
      onAction={start}
      databaseName={databaseName}
      setDatabaseName={setDatabaseName}
      sectionTitle="Active Peer"
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
          <IonLabel position="stacked">Database</IonLabel>
          <IonSelect
            value={databaseName}
            onIonChange={e => setDatabaseName(e.detail.value)}
          >
            {Object.keys(databases).map(dbName => (
              <IonSelectOption key={dbName} value={dbName}>
                {dbName}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Scope Name</IonLabel>
          <IonInput
            value={scopeName}
            onIonChange={e => setScopeName(e.detail.value!)}
            placeholder="_default"
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Collection Name</IonLabel>
          <IonInput
            value={collectionName}
            onIonChange={e => setCollectionName(e.detail.value!)}
            placeholder="_default"
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Listener URL</IonLabel>
          <IonInput
            value={url}
            onIonChange={e => setUrl(e.detail.value!)}
            placeholder="ws://localhost:4984"
          />
        </IonItem>
        <IonItem>
          <IonLabel>Replication Type</IonLabel>
          <IonSelect
            value={replicationType}
            onIonChange={e => setReplicationType(e.detail.value)}
          >
            <IonSelectOption value="push">Push</IonSelectOption>
            <IonSelectOption value="pull">Pull</IonSelectOption>
            <IonSelectOption value="pushAndPull">Push & Pull</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel>Continuous</IonLabel>
          <IonToggle
            checked={continuous}
            onIonChange={e => setContinuous(e.detail.checked)}
          />
        </IonItem>
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

export default ActivePeerPage;