// CreateIndex.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';

import { IonItemDivider, IonLabel, IonItem, IonInput, IonButton } from '@ionic/react';

//import the database in order to create/open a database
import { IndexBuilder, ValueIndexItem } from 'cblite';

const CreateIndexPage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [indexName, setIndexName] = useState<string>('');
  const [indexFields, setIndexFields] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');

  function update() {
    if (databaseName in databases) {
      let db = databases[databaseName];
      if (db != null) {
        //split out properties into an array, trimming out white space
        let properties = indexFields.split(',').map(property => property.trim());
        if (properties.length > 0 && indexName.length > 0) {
          //create value index items to be added to the index using
          //IndxBuilder
          let valueIndexes:ValueIndexItem[] = [];
          for (let i = 0; i < properties.length; i++) {
            valueIndexes.push(ValueIndexItem.property(properties[i].trim()));
          }
          //create the index
          db.createIndex(indexName, IndexBuilder.valueIndex(...valueIndexes))
            .then(() => {
              setResultsMessage('success');
            })
            .catch((error: unknown) => {
              setResultsMessage('' + error);
            });
        } else {
          setResultsMessage(
            'Error: Index name or fields are not defined or not delimited by commas properly',
          );
        }
      }
    } else {
      setResultsMessage('Error: Database is not setup (defined)');
    }
  }

  function setDefaultIndex() {
    setIndexFields('name, active, documentType');
  }

  function reset() {
    setDatabaseName('');
    setIndexName('');
    setIndexFields('');
    setResultsMessage('');
  }

  return (
    <DetailPageContainer
      navigationTitle="Create Index"
      collapseTitle="Create Index"
      onReset={reset}
      onAction={update}
      resultsMessage={resultsMessage}
      actionLabel="Create"
    >
      <DatabaseNameForm
        setDatabaseName={setDatabaseName}
        databaseName={databaseName}
      />
      <IonItemDivider>
        <IonLabel>Index</IonLabel>
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
          onInput={(e: any) => setIndexFields(e.target.value)}
          placeholder="Index Properties (comma separated)"
          value={indexFields}
        ></IonInput>
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

export default CreateIndexPage;
