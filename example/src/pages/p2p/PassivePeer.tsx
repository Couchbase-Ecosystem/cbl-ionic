import React, { useState, useContext, useEffect } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerRun from '../../components/DetailPageContainerRun/DetailPageContainerRun';
import { IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonAccordion, IonAccordionGroup, IonList, IonToggle } from '@ionic/react';
import { URLEndpointListener, MutableDocument } from 'cbl-ionic';

const PassivePeerPage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('p2p_passive');
  const [port, setPort] = useState<number>(4988);
  const [networkInterface, setNetworkInterface] = useState<string>('0.0.0.0');
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [username, setUsername] = useState<string>('testuser');
  const [password, setPassword] = useState<string>('testpass');
  const [disableTLS, setDisableTLS] = useState<boolean>(true);
  const [enableDeltaSync, setEnableDeltaSync] = useState<boolean>(false);
  const [listenerId, setListenerId] = useState<string | null>(null);
  const [listener, setListener] = useState<any>(null);
  const [status, setStatus] = useState<string>('Stopped');
  const [results, setResults] = useState<string[]>([]);
  const [configAccordionOpen, setConfigAccordionOpen] = useState<boolean>(false);
  const [currentConfig, setCurrentConfig] = useState<any>({});

  const [collectionOptions, setCollectionOptions] = useState<{ value: string; label: string }[]>([]);
  const [scopeName, setScopeName] = useState<string>('_default');
  const [collectionName, setCollectionName] = useState<string>('_default');

  useEffect(() => {
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
  }, [databases]);

  async function startListener() {
    setStatus('Starting...');
    try {
      if (!databaseName) {
        setResults(prev => [...prev, 'Please select a database']);
        setStatus('Error');
        return;
      }
      const database = databases[databaseName];
      if (!database) {
        setResults(prev => [...prev, `Database ${databaseName} not found`]);
        setStatus('Error');
        return;
      }
      const collections = [{
        databaseName: database.getUniqueName(),
        scopeName,
        name: collectionName
      }];
      const config = {
        collections,
        port,
        networkInterface,
        disableTLS,
        enableDeltaSync,
        authenticatorConfig: username && password ? {
          type: 'basic' as const,
          data: { username, password }
        } : undefined
      };
      setCurrentConfig(config);
      const listener = await URLEndpointListener.create(config);
      await listener.start();
      setListenerId(listener.getId());
      setStatus('Running');
      setListener(listener);
      setResults(prev => [...prev, `Listener started on port ${port}`]);
    } catch (error: any) {
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
      setCurrentConfig({
        collections: [{ databaseName: databaseName, scopeName, name: collectionName }],
        port,
        networkInterface,
        disableTLS,
        enableDeltaSync,
        authenticatorConfig: username && password ? {
          type: 'basic' as const,
          data: { username, password }
        } : undefined
      });
    } catch (error: any) {
      setStatus('Error');
      setResults(prev => [...prev, `Error stopping listener: ${error.message}`]);
    }
  }

  async function addRandomDocument() {
    if (!databaseName || !(databaseName in databases)) {
      setResults(prev => [...prev, 'Error: Database is not setup']);
      return;
    }
    const db = databases[databaseName];
    const collection = await db.defaultCollection();
    const id = `doc-${Math.floor(Math.random() * 100000)}`;
    const doc = new MutableDocument(id, {
      name: `Document ${id}`,
      description: 'Randomly generated document.',
      timestamp: new Date().toISOString(),
    });
    await collection.save(doc);
    setResults(prev => [...prev, `📄 Document created: ${doc.toJsonString()}`]);
  }

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
        <IonButton expand="full" onClick={addRandomDocument} className="m-1">
          Add Random Document
        </IonButton>
        <IonItem>
          <IonLabel position="stacked">Port</IonLabel>
          <IonInput type="number" value={port} onIonChange={e => setPort(Number(e.detail.value))} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Network Interface</IonLabel>
          <IonInput type="text" value={networkInterface} onIonChange={e => setNetworkInterface(e.detail.value)} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Scope Name</IonLabel>
          <IonInput type="text" value={scopeName} onIonChange={e => setScopeName(e.detail.value)} placeholder="_default" />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Collection Name</IonLabel>
          <IonInput type="text" value={collectionName} onIonChange={e => setCollectionName(e.detail.value)} placeholder="_default" />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Username</IonLabel>
          <IonInput type="text" value={username} onIonChange={e => setUsername(e.detail.value)} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Password</IonLabel>
          <IonInput type="text" value={password} onIonChange={e => setPassword(e.detail.value)} />
        </IonItem>
        <IonItem>
          <IonLabel>Disable TLS</IonLabel>
          <IonToggle checked={disableTLS} onIonChange={e => setDisableTLS(e.detail.checked)} />
        </IonItem>
        <IonItem>
          <IonLabel>Enable Delta Sync</IonLabel>
          <IonToggle checked={enableDeltaSync} onIonChange={e => setEnableDeltaSync(e.detail.checked)} />
        </IonItem>
        <IonItem>
          <IonLabel>Status: {status}</IonLabel>
        </IonItem>
        {listenerId && (
          <IonItem>
            <IonLabel>Listener ID: {listenerId}</IonLabel>
          </IonItem>
        )}
        <IonAccordionGroup value={configAccordionOpen ? 'config' : undefined}>
          <IonAccordion value="config" onClick={() => setConfigAccordionOpen(!configAccordionOpen)}>
            <IonItem slot="header">
              <IonLabel>View Current Config</IonLabel>
            </IonItem>
            <IonList slot="content">
              <IonItem>
                <IonLabel>
                  <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(currentConfig, null, 2)}</pre>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonAccordion>
        </IonAccordionGroup>
      </>
    </DetailPageContainerRun>
  );
};

export default PassivePeerPage;