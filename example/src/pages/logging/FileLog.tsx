// FileLog.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerRun from '../../components/DetailPageContainerRun/DetailPageContainerRun';

import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonToggle,
} from '@ionic/react';

import {
  DatabaseLogging,
  DatabaseFileLoggingConfiguration,
  LogLevel,
  FileSystem,
} from 'cblite';

const FileLogPage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [selectedLogLevel, setSelectedLogLevel] = useState<string>('');
  const [path, setPath] = useState<string>('');
  const [maxRotateCount, setMaxRotateCount] = useState<number>(0);
  const [maxSize, setMaxSize] = useState<number>(0);
  const [usePlainText, setUsePlainText] = useState<boolean>(true);
  const [resultsMessage, setResultsMessage] = useState<string[]>([]);

  function platformPath() {
    const pd = new FileSystem();
    pd.getDefaultPath().then((result: string) => {
      setPath(result);
    });
  }

  async function update() {
    //reset logs for this run
    setResultsMessage([]);
    try {
      //get the log level and domain from selected values back into enum form
      let logKey = -1;
      if (selectedLogLevel !== '') {
        logKey = parseInt(selectedLogLevel);
      }
      const logLevel: LogLevel = logKey;
      if (databaseName in databases) {
        const database = databases[databaseName];
        if (database != null) {
          //set file logging config
          const config: DatabaseFileLoggingConfiguration = {
            directory: path,
            level: logKey, 
            maxRotateCount: maxRotateCount,
            maxSize: maxSize,
            usePlaintext: usePlainText,
          }; 
          const dbLogging = new DatabaseLogging(database);
          dbLogging.setFileConfig(config)
          .then(() => {
            setResultsMessage(prev => [...prev, 'success']);
          }).catch((error: any) => {
            setResultsMessage(prev => [
              ...prev,
              'Error:' + error
            ]);
          });
        }
      } else {
        setResultsMessage(prev => [
          ...prev,
          'Error: Database is not setup (defined)',
        ]);
      }
    } catch (error) {
      setResultsMessage(prev => [...prev, '' + error]);
    }
  }

  function reset() {
    setDatabaseName('');
    setPath('');
    setMaxRotateCount(0);
    setMaxSize(0);
    setUsePlainText(true);
    setSelectedLogLevel('');
    setResultsMessage([]);
  }

  return (
    <DetailPageContainerRun
      navigationTitle="File Logging"
      collapseTitle="File Logging"
      onReset={reset}
      onAction={update}
      databaseName={databaseName}
      setDatabaseName={setDatabaseName}
      sectionTitle="File Information"
      titleButtons={
        <IonButton
          key="btnDefaultDirectory"
          onClick={platformPath}
          style={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '0px 2px 0px 25px',
          }}
        >
          <i className="fa-solid fa-folder"></i>
        </IonButton>
      }
      results={resultsMessage}>
        <>
          <IonItem key={1}>
            <IonTextarea
              key={2}
              rows={6}
              placeholder="Log Directory Path"
              onInput={(e: any) => setPath(e.detail.value)}
              value={path}
            ></IonTextarea>
          </IonItem>
          <IonItem key={3}>
            <IonToggle
              onIonChange={(e: any) => setUsePlainText(e.detail.checked)}
              checked={usePlainText}
            >
              Use Plain Text
            </IonToggle>
          </IonItem>
          <IonItem key={4}>
            <IonLabel key={5}>Select a Log Level</IonLabel>
            <IonSelect
              key={6}
              value={selectedLogLevel}
              onIonChange={e => setSelectedLogLevel(e.detail.value)}
            >
              {Object.entries(LogLevel).map(([key, value]) => (
                <IonSelectOption key={'selectoption' + value} value={key}>
                  {value}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <IonItem key={7}>
            <IonLabel position="stacked" key={7}>
              Max Rotate Count
            </IonLabel>
            <IonInput
              key={8}
              type="number"
              onInput={(e: any) => setMaxRotateCount(e.target.value)}
              value={maxRotateCount}
            ></IonInput>
          </IonItem>
          <IonItem key={9}>
            <IonLabel position="stacked" key={10}>
              Max Size (in bytes)
            </IonLabel>
            <IonInput
              key={11}
              type="number"
              onInput={(e: any) => setMaxSize(e.target.value)}
              value={maxSize}
            ></IonInput>
          </IonItem>
        </>
       </DetailPageContainerRun>
  );
};

export default FileLogPage;
