// SqlPlusPlus.tsx
import React, {useState, useContext, useRef} from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerRun from '../../components/DetailPageContainerRun/DetailPageContainerRun';

import Editor from '@monaco-editor/react';
import {
    IonButton,
    IonButtons,
    IonItemDivider,
    IonLabel,
    IonCard,
    IonText, IonSelect, IonSelectOption
} from "@ionic/react";

const SqlPlusPlusPage: React.FC = () => {

    const {databases} = useContext(DatabaseContext)!;
    const [databaseName, setDatabaseName] = useState<string>('');
    const [resultsMessage, setResultsMessage] = useState<string[]>([]);
    const [parametersCount, setParametersCount] = useState<number>(0);
    const editorRef = useRef(null);
    const parameterTypes: string[] = ['string', 'boolean', 'float', 'double', 'int', 'int64', 'date'];

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    async function update() {
        setResultsMessage([]);
        if (databaseName in databases) {
            const database = databases[databaseName];
            const queryString = editorRef.current.getValue();
            if (database != null && queryString != null) {
                try {
                    const query = database.createQuery(queryString);
                    const resultSet = await query.execute();
                    for (const result of resultSet) {
                        setResultsMessage(prev => [
                            ...prev,
                            `${new Date().toISOString()} Result: ` + JSON.stringify(result),
                        ]);
                    }
                } catch(e){
                    setResultsMessage([`${new Date().toISOString()} Error: ${e}`]);
                }
            }
            else {
                setResultsMessage([`${new Date().toISOString()} Error: Database is null)`]);
            }
        } else {
            setResultsMessage([`${new Date().toISOString()} Error: Database is not setup (defined)`]);
        }
    }

    function addParameter() {
        setParametersCount(prev => prev + 1);
    }

    function reset() {
      setDatabaseName('');
      setResultsMessage([]);
      setParametersCount(0);
    }

    return (
        <DetailPageContainerRun
            navigationTitle="Query SQL++"
            collapseTitle="Query SQL++"
            onReset={reset}
            onAction={update}
            results={resultsMessage}
            databaseName={databaseName}
            setDatabaseName={setDatabaseName}
            sectionTitle="Query"
            titleButtons={ undefined }>
            <>
            <div className="pt-2 pb-2">
            <Editor
                onMount={handleEditorDidMount}
                height="15vh"
                defaultLanguage="sql"
                defaultValue="SELECT * FROM myCollection"
                theme="vs-dark"/>
            </div>
                <IonItemDivider key="parameter-divider-key">
                    <IonLabel key="parameters-divider-label-key">Parameters</IonLabel>
                    <IonButtons slot="end" key="section-divider-buttons-key">
                        <IonButton
                            key="document-batch-divider-right-buttons-validate-button-key"
                            onClick={addParameter}
                            style={{
                                display: 'block',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                padding: '0px 5px',
                            }}
                        >
                            <i className="fa-solid fa-layer-plus"></i>
                        </IonButton>
                    </IonButtons>
                </IonItemDivider>
                {[...Array(parametersCount)].map((_, index) => (
                    <IonCard key={index}>
                    </IonCard>

                ))}
          </>
        </DetailPageContainerRun>
    );
};

export default SqlPlusPlusPage;