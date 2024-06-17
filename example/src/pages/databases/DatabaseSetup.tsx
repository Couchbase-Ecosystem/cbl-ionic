// DatabaseOpen.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import {
  IonButton,
  IonItem,
  IonInput,
} from '@ionic/react';

import DetailPageContainerRun from '../../components/DetailPageContainerRun/DetailPageContainerRun';

//import the database in order to create/open a database
import { 
  Database, 
  DatabaseConfiguration, 
  FileSystem 
} from 'cbl-ionic';

const DatabaseSetupPage: React.FC = () => {
  const { databases, setDatabases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [path, setPath] = useState<string>('');
  const [encryptionKey, setEncryptionKey] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string[]>([]);

  function reset() {
    setDatabaseName('');
    setPath('');
    setEncryptionKey('');
    setResultsMessage([]);
  }

  function platformPath() {
    const pd = new FileSystem();
    pd.getDefaultPath().then((result: string) => {
      setPath(result);
    });
  }

  function update() {
    if (databaseName in databases) {
      setResultsMessage(prev => [...prev, 'Error: Database is already setup in Context']);
    } else {
      let database: Database;
      if (path !== '' || encryptionKey !== '') {
        const config = new DatabaseConfiguration();
        if (path !== '') {
          config.setDirectory(path);
        }
        if (encryptionKey !== '') {
          config.setEncryptionKey(encryptionKey);
        }
        database = new Database(databaseName, config);
      } else {
        database = new Database(databaseName);
      }
      if (database !== null) {
        setDatabases(prevState => ({
          ...prevState,
          [databaseName]: database,
        }));
        setResultsMessage(prev => [...prev, 'success']);
      } else {
        setResultsMessage(prev => [...prev, 'Error: Database is null.']);
      }
    }
  }

  return (
    <DetailPageContainerRun
      navigationTitle="Database Setup"
      collapseTitle="Define Database"
      titleButtons={<IonButton
          key="button-action-path"
          onClick={platformPath}
          style={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '0px 2px 0px 25px',
          }}
      >
        <i className='fa-duotone fa-folder-gear'></i>
      </IonButton>}
      sectionTitle={'Database Configuration'}
      onReset={reset}
      onAction={update}
      databaseName={databaseName}
      setDatabaseName={setDatabaseName}
      results={resultsMessage}
    >
      <IonItem key="item-file-location">
        <IonInput 
          key="item-input-file-location"
          placeholder='File Location'
          onInput={(e: any) => setPath(e.target.value)}
          value={path}
        ></IonInput>
      </IonItem>
      <IonItem key="item-encryption-key">
        <IonInput
          key="item-input-encryption-key"
          onInput={(e: any) => setEncryptionKey(e.target.value)}
          placeholder='Encryption Key'
          value={encryptionKey}
        ></IonInput>
      </IonItem>
    </DetailPageContainerRun>
  );
};

export default DatabaseSetupPage;
