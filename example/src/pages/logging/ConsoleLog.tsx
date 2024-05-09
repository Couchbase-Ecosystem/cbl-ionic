// ConsoleLog.tsx
import React, { useState } from 'react';
import {
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';

import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';

//import the database which has a list of log levels and domains
import { LogLevel, LogDomain, Database } from 'cblite';

const ConsoleLogPage: React.FC = () => {
  //load load levels and domains from couchbase lite plugin
  const logDomains = Object.values(LogDomain);

  const [selectedLogLevel, setSelectedLogLevel] = useState<string>('');
  const [selectedLogDomain, setSelectedLogDomain] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');

  function reset() {
    setSelectedLogLevel('');
    setSelectedLogDomain('');
    setResultsMessage('');
  }

  function update() {
    //get the log level and domain from selected values back into enum form
    let logKey = -1;
    if (selectedLogLevel !== '')
    {
      logKey = parseInt(selectedLogLevel);
    }
    let logDomain = LogDomain[selectedLogDomain as keyof typeof LogDomain];
    let logLevel: LogLevel = logKey;

    //the plugin currently requires a database to get the engine set in order to set the log level.  This should be static, but that would cause an issue because then the engine isn't defined.  For now, we'll just create a new database and set the log level on it, but note that the log level is for all databases, not just this one.
    let db = new Database('test');
    db.setLogLevel(logDomain, logLevel)
      .then(() => {
        setResultsMessage('success');
      })
      .catch((error: unknown) => {
        setResultsMessage('' + error);
      });
  }

  return (
    <DetailPageContainer
      navigationTitle="Console Log"
      collapseTitle="Console Log"
      onReset={reset}
      onAction={update}
      resultsMessage={resultsMessage}
      actionLabel="Update">
      <IonList>
        <IonItem key={0}>
          <IonLabel key={1}>Select a Log Domain</IonLabel>
          <IonSelect key={2}
            value={selectedLogDomain}
            onIonChange={e => setSelectedLogDomain(e.detail.value)}
          >
            {logDomains.map(domain => (
              <IonSelectOption key={domain} value={domain}>{domain}</IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonItem key={3}>
          <IonLabel key={4}>Select a Log Level</IonLabel>
          <IonSelect 
            key={5}
            value={selectedLogLevel}
            onIonChange={e => setSelectedLogLevel(e.detail.value)}
          >
            {Object.entries(LogLevel).map(([key, value]) => (
              <IonSelectOption key={value} value={key}>{value}</IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
      </IonList>
    </DetailPageContainer>
  );
};

export default ConsoleLogPage;
