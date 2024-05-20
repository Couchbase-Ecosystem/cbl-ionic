// QueryFTS.tsx
import './QueryBuilder.css';
import React, {useState, useContext} from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerItemResults
    from '../../components/DetailPageContainerItemResults/DetailPageContainerItemResults';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';

import {
    IonItemDivider,
    IonLabel,
    IonButton,
    IonButtons,
    IonInput,
    IonIcon,
    IonItem,
} from '@ionic/react';

import {playOutline} from 'ionicons/icons';

const QueryFTSPage: React.FC = () => {
    const {databases} = useContext(DatabaseContext)!;
    const [databaseName, setDatabaseName] = useState<string>('');
    const [indexName, setIndexName] = useState<string>('');
    const [propertyValue, setPropertyValue] = useState<string>('');
    const [resultsMessage, setResultsMessage] = useState<string[]>([]);

    async function update() {
        if (databaseName in databases) {
            const database = databases[databaseName];
            if (database != null) {
                if (indexName.length > 0 && propertyValue.length > 0) {
                    //create query
                    const whereClause = "MATCH(" + indexName + ", '" + propertyValue + "')";
                    const ftsQueryString = "SELECT * FROM " + whereClause;
                    const ftsQuery = database.createQuery(ftsQueryString);
                    try {
                        const results = await ftsQuery.execute();
                        const resultsArray: string[] = []
                        for (const key in results) {
                            resultsArray.push(JSON.stringify(results[key]));
                        }
                        setResultsMessage(resultsArray);
                    } catch (error) {
                        setResultsMessage([
                            `Error: ${error}`,
                        ]);
                    }
                } else {
                    setResultsMessage(prev => [...prev,
                        `${new Date().toISOString()} Error: Property Name or Property Value not defined`,
                    ]);
                }
            } else {
                setResultsMessage(prev => [...prev, `${new Date().toISOString()} Error: Index name or field is not defined`]);
            }
        } else {
            setResultsMessage( prev => [...prev, `${new Date().toISOString()} Error: Database is not setup (defined)`]);
        }
    }

    function reset() {
        setDatabaseName('');
        setIndexName('');
        setPropertyValue('');
        setResultsMessage([]);
    }

    return (
        <DetailPageContainerItemResults
            navigationTitle="Query Builder FTS"
            collapseTitle="Query Builder FTS"
            onReset={reset}
            resultsCount="0"
            children={
                <>
                    <DatabaseNameForm
                        setDatabaseName={setDatabaseName}
                        databaseName={databaseName}
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
                                <IonIcon icon={playOutline}/>
                            </IonButton>
                        </IonButtons>
                    </IonItemDivider>

                    <IonItem key={2}>
                        <IonInput
                            onInput={(e: any) => setIndexName(e.target.value)}
                            placeholder="FTS Index Name"
                            value={indexName}
                        ></IonInput>
                    </IonItem>
                    <IonItem key={3}>
                        <IonInput
                            onInput={(e: any) => setPropertyValue(e.target.value)}
                            placeholder="Value to Search"
                            value={propertyValue}
                        ></IonInput>
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
export default QueryFTSPage;
