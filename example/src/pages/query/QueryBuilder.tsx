// QueryBuilder.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerItemResults from '../../components/DetailPageContainerItemResults/DetailPageContainerItemResults';
import DatabaseCollectionForm from '../../components/DatabaseCollectionForm/DatabaseCollectionForm';

import {
  QueryGeneratorService,
} from '../../services/QueryBuilderGeneratorService';

import {
  IonItemDivider,
  IonLabel,
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';

import { playOutline } from 'ionicons/icons';

const QueryBuilderPage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [collectionName, setCollectionName] = useState<string>('');
  const [scopeName, setScopeName] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string[]>([]);
  const [resultsCount, setResultsCount] = useState<string>('');
  const [selectedQuery, setSelectedQuery] = useState<string>('');

  //set the select list of queries we can test
  const queries: string[] = QueryGeneratorService.queries;

  async function update() {
    if (databaseName in databases) {
      const database = databases[databaseName];
      const collection = await database.collection(collectionName, scopeName);
      if (database != null && collection != null && selectedQuery !== '') {
        setResultsMessage([]);
        const queries = QueryGeneratorService.getQueries(collection);
        let queryString: string | undefined;

        for (const dictionary of queries) {
          if (dictionary[selectedQuery]) {
            queryString = dictionary[selectedQuery];
            break;
          }
        }
        if (queryString !== undefined) {
          try {
            const query = database.createQuery(queryString);
            const resultSet = await query.execute();
            setResultsCount(resultSet.length.toString());

            /* TODO FIX PRINTING OF RESULTS
            for (const result of resultSet){
              setResultsMessage(prev => [...prev, JSON.stringify(result)]);
            }
            */
          } catch (e) {
            setResultsMessage(prev => [...prev, 'Error Data Validation: ' + e]);
          }
        }
      } else {
        setResultsMessage(['Error: Database is null or query is not selected']);
      }
    } else {
      setResultsMessage(['Error: Database is not setup (defined)']);
    }
  }

  function reset() {
    setDatabaseName('');
    setResultsCount('');
    setResultsMessage([]);
  }

  return (
    <DetailPageContainerItemResults
      navigationTitle="Query Builder"
      collapseTitle="Query Builder"
      onReset={reset}
      resultsCount={resultsCount}
      children={
        <>
          <DatabaseCollectionForm
            setDatabaseName={setDatabaseName}
            databaseName={databaseName}
            setCollectionName={setCollectionName}
            collectionName={collectionName}
            setScopeName={setScopeName}
            scopeName={scopeName}
          />
          <IonItemDivider>
            <IonLabel>Query Builder</IonLabel>
            <IonButtons slot="end">
              <IonButton
                onClick={update}
                style={{
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  padding: '0px 5px',
                }}
              >
                <IonIcon icon={playOutline} />
              </IonButton>
            </IonButtons>
          </IonItemDivider>
          <IonItem key={2}>
            <IonLabel>Select Query</IonLabel>
            <IonSelect
              value={selectedQuery}
              onIonChange={e => setSelectedQuery(e.detail.value)}
            >
              {queries.map(query => (
                <IonSelectOption key={query} value={query}>
                  {query}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        </>
      }
      resultsChildren={
        <>
          {resultsMessage.map((message, index) => (
            <IonItem key={index} className="wrap-text">
              <IonLabel className="wrap-text">{message}</IonLabel>
            </IonItem>
          ))}
        </>
      }
    ></DetailPageContainerItemResults>
  );
};
export default QueryBuilderPage;
