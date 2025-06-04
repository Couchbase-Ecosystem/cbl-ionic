import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerRun from '../../components/DetailPageContainerRun/DetailPageContainerRun';
import { IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';
import { URLEndpointListener } from 'cbl-ionic';

const PassivePeerPage: React.FC = () => {
    const [databaseName, setDatabaseName] = useState<string>('');
  const { databases } = useContext(DatabaseContext)!;
  const [port, setPort] = useState<number>(4984);
  const [networkInterface, setNetworkInterface] = useState<string>('192.168.0.100');
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [listenerId, setListenerId] = useState<string | null>(null);
  const [listener, setListener] = useState<URLEndpointListener | null>(null);
  const [status, setStatus] = useState<string>('Stopped');
  const [results, setResults] = useState<string[]>([]);

  async function startListener() {
    setStatus('Starting...');
    try {
    const database = databases[databaseName];
    if (!database) {
      setResults(prev => [...prev, `Database ${databaseName} not found`]);
      return;
    }

      const listener = await URLEndpointListener.create(
        {
            collections: [{
               databaseName: database.getUniqueName(),
               scopeName: "_default",
               name: "_default"
            }],
            port,
            networkInterface,
        }
      );
    await listener.start();
    setListenerId(listener.getId());
    setStatus('Running');
    setListener(listener);
    setResults(prev => [...prev, `Listener started on port ${port}`]);
    } catch (error) {
      setStatus('Error');
      setResults(prev => [...prev, `Error starting listener: ${error.message}`]);
    }
  }

  async function stopListener() {
    setStatus('Stopping...');
    try {
     await listener?.stop();

    setStatus('Stopped');
    setResults(prev => [...prev, 'Listener stopped']);
    } catch (error) {
      setStatus('Error');
      setResults(prev => [...prev, `Error stopping listener: ${error.message}`]);
    }
  }

  const [collectionOptions, setCollectionOptions] = useState<{ value: string; label: string }[]>([]);

  React.useEffect(() => {
    const fetchCollections = async () => {
      const options = await Promise.all(
        Object.entries(databases).map(async ([dbName, db]) => {
          const collections = await db.collections();
          return collections.map((col: any) => ({
            value: `${dbName}|${col.scope}|${col.name}`,
            label: `${dbName}.${col.scope}.${col.name}`,
          }));
        })
      );
      setCollectionOptions(options.flat());
    };

    fetchCollections();
  }, [databaseName]);

  return (
    <DetailPageContainerRun
      navigationTitle="Passive Peer"
      collapseTitle="Passive Peer"
      onReset={stopListener}
        databaseName={databaseName}
        setDatabaseName={setDatabaseName}
        titleButtons={[]}
      onAction={startListener}
      sectionTitle="Passive Peer"
      results={results}
    >
      <>
        <IonItem>
          <IonLabel position="stacked">Port</IonLabel>
          <IonInput
            type="number"
            value={port}
            onIonChange={e => setPort(Number(e.detail.value))}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Network Inteface</IonLabel>
          <IonInput
            type="text"
            value={networkInterface}
            onIonChange={e => setNetworkInterface(e.detail.value)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Collections</IonLabel>
          <IonSelect
            multiple
            value={selectedCollections}
            onIonChange={e => setSelectedCollections(e.detail.value)}
          >
            {collectionOptions.map(opt => (
              <IonSelectOption key={opt.value} value={opt.value}>
                {opt.label}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel>Status: {status}</IonLabel>
        </IonItem>
        {listenerId && (
          <IonItem>
            <IonLabel>Listener ID: {listenerId}</IonLabel>
          </IonItem>
        )}
        <IonButton expand="full" onClick={startListener} disabled={status === 'Running'}>
          Start Listener
        </IonButton>
        <IonButton expand="full" onClick={stopListener} >
          Stop Listener
        </IonButton>
      </>
    </DetailPageContainerRun>
  );
};

export default PassivePeerPage;