// DatabaseDelete.tsx
import React, { useState, useContext } from "react";
import DatabaseContext from "../../providers/DatabaseContext";
import DetailPageDatabaseContainerRun from "../../components/DetailPageDatabaseContainerRun/DetailPageDatabaseContainerRun";

const DatabaseDeletePage: React.FC = () => {
  const { databases, setDatabases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>("");
  const [resultsMessage, setResultsMessage] = useState<string[]>([]);

  function reset() {
    setDatabaseName("");
    setResultsMessage([]);
  }

  async function update() {
    if (databaseName in databases) {
      const database = databases[databaseName];
      if (database != null) {
        try {
          await database.deleteDatabase();
          setDatabases((prevState) => {
            //after closing the database remove it from the provider
            const newState = { ...prevState };
            delete newState[databaseName];
            return newState;
          });
          setResultsMessage((prev) => [...prev, "success"]);
        } catch (error) {
          setResultsMessage((prev) => [...prev, "" + error]);
        }
      } else {
        setResultsMessage((prev) => [...prev, "Error: Database not found"]);
      }
    }
  }

  return (
    <DetailPageDatabaseContainerRun
      navigationTitle="Database Delete"
      collapseTitle="Database Delete"
      titleButtons={undefined}
      onReset={reset}
      onAction={update}
      databaseName={databaseName}
      setDatabaseName={setDatabaseName}
      results={resultsMessage}
    ></DetailPageDatabaseContainerRun>
  );
};

export default DatabaseDeletePage;
