import React, { useState, useContext, useEffect } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerRun from '../../components/DetailPageContainerRun/DetailPageContainerRun';
import { IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonToggle, IonAccordion, IonAccordionGroup, IonList } from '@ionic/react';
import { MutableDocument, Replicator, ReplicatorConfiguration, ReplicatorType, URLEndpoint, ReplicatorActivityLevel } from 'cblite-js';

const ActivePeerPage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [activeDbName, setActiveDbName] = useState<string>('p2p_active');
  const [remoteDbName, setRemoteDbName] = useState<string>('p2p_passive');
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [baseUrl, setBaseUrl] = useState<string>('ws://localhost:4988');
  const [fullUrl, setFullUrl] = useState<string>('');
  const [replicationType, setReplicationType] = useState<'push' | 'pull' | 'pushAndPull'>('pushAndPull');
  const [continuous, setContinuous] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('testuser');
  const [password, setPassword] = useState<string>('testpass');
  const [acceptSelfSigned, setAcceptSelfSigned] = useState<boolean>(true);
  const [replicator, setReplicator] = useState<any>(null);
  const [replicatorStatus, setReplicatorStatus] = useState<string>('Idle');
  const [resultsMessage, setResultsMessage] = useState<string[]>([]);
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

  useEffect(() => {
    if (!replicator) return;
    let token: any = null;
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

  useEffect(() => {
    if (!remoteDbName || !(remoteDbName in databases)) {
      setFullUrl('');
      return;
    }
    const db = databases[remoteDbName];
    setFullUrl(`${baseUrl}/${db.getName()}`);
  }, [baseUrl, remoteDbName, databases]);

  async function startReplicator() {
    if (!activeDbName) {
      setResultsMessage(prev => [...prev, 'Please select a local (active) database']);
      return;
    }
    if (!remoteDbName) {
      setResultsMessage(prev => [...prev, 'Please select a remote (passive) database']);
      return;
    }
    const localDb = databases[activeDbName];
    const remoteDb = databases[remoteDbName];
    if (!localDb) {
      setResultsMessage(prev => [...prev, `Local database ${activeDbName} not found`]);
      return;
    }
    if (!remoteDb) {
      setResultsMessage(prev => [...prev, `Remote database ${remoteDbName} not found`]);
      return;
    }
    const collections = [{
      databaseName: activeDbName,
      scopeName,
      name: collectionName
    }];
    const endpointUrl = `${baseUrl}/${remoteDb.getName()}`;
    const config = {
      endpoint: endpointUrl,
      collections,
      replicatorType: replicationType,
      continuous,
      acceptOnlySelfSignedCerts: acceptSelfSigned,
      authenticator: username && password ? { type: 'basic', username, password } : undefined
    };
    setCurrentConfig(config);
    try {
      const endpoint = new URLEndpoint(endpointUrl);
      const repConfig = new ReplicatorConfiguration(endpoint);
      const collection = await localDb.collection(collectionName, scopeName);
      if (collection) repConfig.addCollection(collection);
      repConfig.setReplicatorType(
        replicationType === 'push' ? ReplicatorType.PUSH :
        replicationType === 'pull' ? ReplicatorType.PULL : ReplicatorType.PUSH_AND_PULL
      );
      repConfig.setContinuous(continuous);
      repConfig.setAcceptOnlySelfSignedCerts(acceptSelfSigned);
      if (username && password) {
        const { BasicAuthenticator } = await import('cblite-js');
        repConfig.setAuthenticator(new BasicAuthenticator(username, password));
      }
      const replicator = await Replicator.create(repConfig);
      setReplicator(replicator);
      await replicator.start(false);
      setResultsMessage(prev => [...prev, 'Replicator started']);
    } catch (error: any) {
      setResultsMessage(prev => [...prev, `Error starting replicator: ${error.message}`]);
    }
  }

  async function stopReplicator() {
    try {
      await replicator?.stop();
      setReplicatorStatus('Stopped');
      setResultsMessage(prev => [...prev, 'Replicator stopped']);
    } catch (error: any) {
      setResultsMessage(prev => [...prev, `Error stopping replicator: ${error.message}`]);
    }
  }

  async function addRandomDocument() {
    if (!activeDbName || !(activeDbName in databases)) {
      setResultsMessage(prev => [...prev, 'Error: Local (active) database is not setup']);
      return;
    }
    const db = databases[activeDbName];
    const collection = await db.defaultCollection();
    const id = `doc-${Math.floor(Math.random() * 100000)}`;
    const doc = new MutableDocument(id, {
      name: `Document ${id}`,
      description: 'Randomly generated document.',
      timestamp: new Date().toISOString(),
    });
    await collection.save(doc);
    setResultsMessage(prev => [...prev, `📄 Document created: ${doc.toJsonString()}`]);
  }

  function reset() {
    setActiveDbName('p2p_active');
    setRemoteDbName('p2p_passive');
    setSelectedCollections([]);
    setBaseUrl('ws://localhost:4988');
    setFullUrl('');
    setReplicator(null);
    setReplicatorStatus('Idle');
    setResultsMessage([]);
    setUsername('testuser');
    setPassword('testpass');
    setAcceptSelfSigned(true);
    setContinuous(true);
    setReplicationType('pushAndPull');
    setCurrentConfig({
      endpoint: `${baseUrl}/${databases[remoteDbName]?.getName() || ''}`,
      collections: [{ databaseName: activeDbName, scopeName, name: collectionName }],
      replicatorType: replicationType,
      continuous,
      acceptOnlySelfSignedCerts: acceptSelfSigned,
      authenticator: username && password ? { type: 'basic', username, password } : undefined
    });
    setScopeName('_default');
    setCollectionName('_default');
  }

  return (
    <DetailPageContainerRun
      navigationTitle="Active Peer"
      collapseTitle="Active Peer"
      onReset={reset}
      onAction={startReplicator}
      databaseName={activeDbName}
      setDatabaseName={setActiveDbName}
      sectionTitle="Active Peer"
      titleButtons={
        <IonButton key="button-stop-key" onClick={stopReplicator} style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', padding: '0px 2px 0px 25px' }}>
          <i className="fa-solid fa-stop"></i>
        </IonButton>
      }
      results={resultsMessage}
    >
      <>
        <IonButton expand="full" onClick={addRandomDocument} className="m-1">
          Add Random Document
        </IonButton>
        <IonItem>
          <IonLabel position="stacked">Base URL (address:port)</IonLabel>
          <IonInput value={baseUrl} onIonChange={e => setBaseUrl(e.detail.value!)} placeholder="ws://localhost:4988" />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Local (Active) Database Name</IonLabel>
          <IonInput value={activeDbName} onIonChange={e => setActiveDbName(e.detail.value!)} placeholder="p2p_active" />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Remote (Passive) Database Name</IonLabel>
          <IonInput value={remoteDbName} onIonChange={e => setRemoteDbName(e.detail.value!)} placeholder="p2p_passive" />
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
          <IonLabel position="stacked">Full Listener URL</IonLabel>
          <IonInput value={fullUrl} readonly />
        </IonItem>
        <IonItem>
          <IonLabel>Replication Type</IonLabel>
          <IonSelect value={replicationType} onIonChange={e => setReplicationType(e.detail.value)}>
            <IonSelectOption value="push">Push</IonSelectOption>
            <IonSelectOption value="pull">Pull</IonSelectOption>
            <IonSelectOption value="pushAndPull">Push & Pull</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel>Continuous</IonLabel>
          <IonToggle checked={continuous} onIonChange={e => setContinuous(e.detail.checked)} />
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
          <IonLabel>Accept Self-Signed Certs</IonLabel>
          <IonToggle checked={acceptSelfSigned} onIonChange={e => setAcceptSelfSigned(e.detail.checked)} />
        </IonItem>
        <IonItem>
          <IonLabel>Replicator Status: {replicatorStatus}</IonLabel>
        </IonItem>
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

export default ActivePeerPage;