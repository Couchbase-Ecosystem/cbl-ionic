// CreateFTSIndex.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';

import { IonItemDivider, IonLabel, IonItem, IonInput, IonButton, IonToggle } from '@ionic/react';

import { IndexBuilder, FullTextIndexItem } from 'cblite';

const CreateFTSIndexPage: React.FC = () => {

  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [indexName, setIndexName] = useState<string>('');
  const [indexField, setIndexField] = useState<string>('');
  const [ignoreAccents, setIgnoreAccents] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');

  function update () {
    if (databaseName in databases) {
      let db = databases[databaseName];
      if (db != null) {
        //get the property to create the index on
          //create the index
          let indexProperty = FullTextIndexItem.property(indexField);
          let index = IndexBuilder.fullTextIndex(indexProperty).setIgnoreAccents(ignoreAccents);

          db.createIndex(indexName, index)
            .then(() => {
              setResultsMessage('success');
            })
            .catch((error: unknown) => {
              setResultsMessage('' + error);
            });
        } else {
          setResultsMessage(
            'Error: Index name or field is not defined',
          );
        }
    } else {
      setResultsMessage('Error: Database is not setup (defined)');
    }
  }

  function setDefaultIndex() {
    setIndexField('name');
    setLanguage('en');
    setIgnoreAccents(false);
  }

  function reset () {
    setDatabaseName('');
    setIndexName('');
    setIndexField('');
    setLanguage('');
    setResultsMessage('');
    setIgnoreAccents(false);
  }
  
  return (
    <DetailPageContainer 
    navigationTitle="Create FTS Index" collapseTitle="Create FTS Index"
    onReset={reset}
    onAction={update}
    resultsMessage={resultsMessage}
    actionLabel="Create">
      <DatabaseNameForm
        setDatabaseName={setDatabaseName}
        databaseName={databaseName}  />
      <IonItemDivider>
        <IonLabel>FTS Index</IonLabel>
      </IonItemDivider>
      <IonItem key={3}>
        <IonInput
          onInput={(e: any) => setIndexName(e.target.value)}
          placeholder="Index Name"
          value={indexName}
        ></IonInput>
      </IonItem>
      <IonItem key={4}>
        <IonInput
          onInput={(e: any) => setIndexField(e.target.value)}
          placeholder="Index Property"
          value={indexField}
        ></IonInput>
      </IonItem>
      <IonItem key={5}>
        <IonInput
          onInput={(e: any) => setLanguage(e.target.value)}
          placeholder="Language"
          value={language}
        ></IonInput>
      </IonItem>
      <IonItem key={6}>
        <IonToggle
          onIonChange={(e: any) => setIgnoreAccents(e.target.value)}
          checked={ignoreAccents}
        >Ignore Anccents</IonToggle>
      </IonItem>
      <IonButton
          		onClick={setDefaultIndex}
          		style={{
            		display: 'block',
            		marginLeft: 'auto',
            		marginRight: 'auto',
            		padding: '20px 80px',
          		}}
        		>
          Set Default Index
        	</IonButton>
    </DetailPageContainer>
  );
};

export default CreateFTSIndexPage;