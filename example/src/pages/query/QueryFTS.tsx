// QueryFTS.tsx
import './LiveQuery.css';
import React, { useState, useContext, useEffect, useRef } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerItemResults from '../../components/DetailPageContainerItemResults/DetailPageContainerItemResults';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';

import {
    IonItemDivider,
    IonLabel,
    IonButton,
    IonInput,
    IonItem,
    IonCheckbox,
} from '@ionic/react';

import Editor from '@monaco-editor/react';
import { FullTextIndexItem, IndexBuilder } from 'cbl-ionic';

const QueryFTSPage: React.FC = () => {
    const { databases } = useContext(DatabaseContext)!;
    const [databaseName, setDatabaseName] = useState<string>('');
    const [selectedExample, setSelectedExample] = useState<any>(null);
    const [indexCreated, setIndexCreated] = useState<boolean>(false);
    const [resultsMessage, setResultsMessage] = useState<string[]>([]);
    const [indexName, setIndexName] = useState<string>('');
    const [indexField, setIndexField] = useState<string>('');
    const [ignoreAccents, setIgnoreAccents] = useState<boolean>(false);
    const editorRef = useRef(null);

    const exampleQueries = [
        {
            label: "Search for 'Smartphone' in product names",
            indexName: "productNameIndex",
            propertyValue: "Smartphone",
            fields: ["name"],
        },
        {
            label: "Search for 'Electronics' in categories",
            indexName: "categoryIndex",
            propertyValue: "Electronics",
            fields: ["category"],
        },
        {
            label: "Search for 'Warehouse 1' in locations",
            indexName: "locationIndex",
            propertyValue: "Warehouse 1",
            fields: ["location"],
        },
    ];

    useEffect(() => {
        if (databaseName) {
            setIndexCreated(false);
        }
    }, [databaseName]);

    function handleExampleSelection(exampleLabel: string) {
        const selected = exampleQueries.find((query) => query.label === exampleLabel);
        if (selected) {
            setSelectedExample(selected);
            setIndexName(selected.indexName);
            setIndexField(selected.fields[0]);
            setIgnoreAccents(false);

            const fullQuery = `SELECT * FROM _default WHERE MATCH(${selected.indexName}, '${selected.propertyValue}')`;
            if (editorRef.current) {
                editorRef.current.setValue(fullQuery);
            }

            setIndexCreated(false);
            setResultsMessage([]);
        }
    }

    async function createFTSIndex() {
        if (databaseName in databases && indexName && indexField) {
            const database = databases[databaseName];
            try {
                const indexProperty = FullTextIndexItem.property(indexField);

                const index = IndexBuilder.fullTextIndex(indexProperty).setIgnoreAccents(ignoreAccents);

                await database.createIndex(indexName, index);

                setIndexCreated(true);
                setResultsMessage([`FTS Index '${indexName}' created successfully.`]);
            } catch (error) {
                setResultsMessage([`Error creating FTS Index: ${error}`]);
            }
        } else {
            setResultsMessage(["Error: Database, index name, or field is not defined."]);
        }
    }

    async function runQuery() {
        if (databaseName in databases && editorRef.current) {
            const database = databases[databaseName];
            try {
                const queryString = editorRef.current.getValue();
                const query = database.createQuery(queryString);
                const results = await query.execute();
                const resultsArray: string[] = [];
                for (const key in results) {
                    resultsArray.push(JSON.stringify(results[key]));
                }
                setResultsMessage(resultsArray);
            } catch (error) {
                setResultsMessage([`Error running query: ${error}`]);
            }
        } else {
            setResultsMessage(["Error: Database or query is not defined."]);
        }
    }

    function reset() {
        setDatabaseName('');
        setSelectedExample(null);
        setIndexCreated(false);
        setResultsMessage([]);
        setIndexName('');
        setIndexField('');
        setIgnoreAccents(false);
    }

    return (
        <DetailPageContainerItemResults
            navigationTitle="Query Builder FTS"
            collapseTitle="Query Builder FTS"
            onReset={reset}
            resultsCount={resultsMessage.length.toString()}
            children={
                <>
                    <DatabaseNameForm
                        setDatabaseName={setDatabaseName}
                        databaseName={databaseName}
                    />
                    <IonItemDivider>
                        <IonLabel>Example Queries</IonLabel>
                    </IonItemDivider>
                    <div style={{ padding: "10px" }}>
                        <select
                            defaultValue=""
                            onChange={(e) => handleExampleSelection(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px",
                                fontSize: "14px",
                            }}
                        >
                            <option value="" disabled>
                                Select an example query
                            </option>
                            {exampleQueries.map((example, index) => (
                                <option key={index} value={example.label}>
                                    {example.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <IonItemDivider>
                        <IonLabel>Custom Index Builder</IonLabel>
                    </IonItemDivider>
                    <IonItem>
                        <IonInput
                            onInput={(e: any) => setIndexName(e.target.value)}
                            placeholder="Index Name"
                            value={indexName}
                        ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonInput
                            onInput={(e: any) => setIndexField(e.target.value)}
                            placeholder="Index Field"
                            value={indexField}
                        ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Ignore Accents</IonLabel>
                        <IonCheckbox
                            checked={ignoreAccents}
                            onIonChange={(e: any) => setIgnoreAccents(e.detail.checked)}
                        ></IonCheckbox>
                    </IonItem>
                    <IonButton
                        onClick={createFTSIndex}
                        disabled={indexCreated}
                        style={{
                            display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            padding: '10px 20px',
                        }}
                    >
                        {indexCreated ? "Index Created" : "Create Index"}
                    </IonButton>

                    <IonItemDivider>
                        <IonLabel>Custom Query Editor</IonLabel>
                    </IonItemDivider>
                    <div className="pt-2 pb-2">
                        <Editor
                            onMount={(editor) => (editorRef.current = editor)}
                            height="15vh"
                            defaultLanguage="sql"
                            defaultValue="SELECT * FROM _default"
                            theme="vs-dark"
                            options={{
                                wordWrap: "on",
                                wrappingIndent: "same",
                            }}
                        />
                    </div>

                    {selectedExample && (
                        <>
                            <IonItemDivider>
                                <IonLabel>Step 2: Run Query</IonLabel>
                            </IonItemDivider>
                            <IonButton
                                onClick={runQuery}
                                style={{
                                    display: 'block',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    padding: '10px 20px',
                                }}
                            >
                                Run Query
                            </IonButton>
                        </>
                    )}
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
