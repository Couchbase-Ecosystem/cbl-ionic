// DatabaseCopy.tsx
import React, {useState, useContext} from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import {
    IonButton,
    IonItem,
    IonInput,
} from '@ionic/react';


import DetailPageContainerRun from '../../components/DetailPageContainerRun/DetailPageContainerRun';

//import the database in order to create/open a database
import {DatabaseConfiguration, FileSystem} from 'cblite';

const DatabaseCopyPage: React.FC = () => {
    const {databases} = useContext(DatabaseContext)!;
    const [currentDatabaseName, setCurrentDatabaseName] = useState<string>('');
    const [databaseName, setDatabaseName] = useState<string>('');
    const [path, setPath] = useState<string>('');
    const [encryptionKey, setEncryptionKey] = useState<string>('');
    const [resultsMessage, setResultsMessage] = useState<string[]>([]);

    function reset() {
        setCurrentDatabaseName('');
        setDatabaseName('');
        setPath('');
        setEncryptionKey('');
        setResultsMessage([]);
    }

    async function platformPath() {
        try {
            const pd = new FileSystem();
            const result = await pd.getDefaultPath()
            setPath(result);
        } catch (error){
            setResultsMessage(prev => [...prev, 'Error: ' + error]);
        }
    }

    async function update() {
        if (currentDatabaseName in databases) {
            const database = databases[currentDatabaseName];
            if (database != null) {
                try {
                    const currentPath = await database.getPath()
                    const config = new DatabaseConfiguration();
                    if (path !== '') {
                        config.directory = path;
                    }
                    if (encryptionKey !== '') {
                        config.encryptionKey = encryptionKey;
                    }
                    await database.close()
                    await database.copy(currentPath, databaseName, config)
                    await database.open();
                    setResultsMessage(prev => [...prev, 'success']);
                } catch (error) {
                    setResultsMessage(prev => [...prev, 'Error: ' + error]);
                }
            }
        } else {
            setResultsMessage(prev => [...prev, 'Error: Database not in context.']);
        }
    }

    return (
        <DetailPageContainerRun
            navigationTitle="Database Copy"
            collapseTitle="Database Copy"
            titleButtons={<IonButton
                key="button-action"
                onClick={platformPath}
                style={{
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    padding: '0px 2px 0px 25px',
                }}
            >
                <i className="fa-duotone fa-folder-gear"></i>
            </IonButton>}
            sectionTitle={'New Database Configuration'}
            onReset={reset}
            onAction={update}
            databaseName={currentDatabaseName}
            setDatabaseName={setCurrentDatabaseName}
            results={resultsMessage}>
            <IonItem key={1}>
                <IonInput
                    onInput={(e: any) => setDatabaseName(e.target.value)}
                    placeholder="New Database Name"
                    value={databaseName}
                ></IonInput>
            </IonItem>
            <IonItem key={2}>
                <IonInput
                    placeholder="New Path"
                    onInput={(e: any) => setPath(e.target.value)}
                    value={path}
                ></IonInput>
            </IonItem>
            <IonItem key={3}>
                <IonInput
                    onInput={(e: any) => setEncryptionKey(e.target.value)}
                    placeholder="New Encryption Key"
                    value={encryptionKey}
                ></IonInput>
            </IonItem>
        </DetailPageContainerRun>
    );
};

export default DatabaseCopyPage;
