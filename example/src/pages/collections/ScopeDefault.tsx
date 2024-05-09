// ScopeDefault.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageDatabaseContainerRun from '../../components/DetailPageDatabaseContainerRun/DetailPageDatabaseContainerRun';

const ScopeDefaultPage: React.FC = () => {

    const { databases } = useContext(DatabaseContext)!;
    const [databaseName, setDatabaseName] = useState<string>('');
    const [resultsMessage, setResultsMessage] = useState<string[]>([]);

    async function update() {
        setResultsMessage([]);
        if (databaseName in databases) {
            const database = databases[databaseName];
            if (database != null) {
                try {
                    const scope = await database.defaultScope();
                    if (scope != null) {
                        setResultsMessage([scope.name]);
                    } else {
                        setResultsMessage(['Error: scope not found']);
                    }
                } catch (error) {
                    setResultsMessage(['Error: ' + error]);
                }
            } else {
                setResultsMessage(['Error: database not available']);
            }
        } else {
            setResultsMessage(prev => [...prev, 'Error: Database is not setup (defined)']);
        }
    }

    function reset () {
        setDatabaseName('');
        setResultsMessage([]);
    }

    return (
        <DetailPageDatabaseContainerRun
            navigationTitle="Default Scopes"
            collapseTitle="Default Scopes"
            titleButtons={undefined}
            onReset={reset}
            onAction={update}
            databaseName={databaseName}
            setDatabaseName={setDatabaseName}
            results={resultsMessage}
        >
        </DetailPageDatabaseContainerRun>
    );
};
export default ScopeDefaultPage;