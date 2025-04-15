// SqlPlusPlus.tsx
import React, { useState, useContext, useRef, useEffect } from "react";
import DatabaseContext from "../../providers/DatabaseContext";
import DetailPageContainerRun from "../../components/DetailPageContainerRun/DetailPageContainerRun";

import Editor from "@monaco-editor/react";
import { IonItemDivider, IonLabel } from "@ionic/react";
import { Link } from "react-router-dom";

const exampleQueries = [
    {
        label: "Get all products",
        query: `SELECT * FROM _default WHERE documentType = "product"`,
    },
    {
        label: "Products on sale",
        query: `SELECT name, price 
FROM _default 
WHERE documentType = "product" 
  AND isOnSale = true`,
    },
    {
        label: "Products grouped by category",
        query: `SELECT category, COUNT(*) AS productCount 
FROM _default 
WHERE documentType = "product" 
GROUP BY category`,
    },
    {
        label: "Products with quantity > 50",
        query: `SELECT name, quantity 
FROM _default 
WHERE documentType = "product" 
  AND quantity > 50`,
    },
    {
        label: "Products with price > 500",
        query: `SELECT name, price 
FROM _default 
WHERE documentType = "product" 
  AND price > 500`,
    },
    {
        label: "Products grouped by location",
        query: `SELECT location, COUNT(*) AS productCount 
FROM _default 
WHERE documentType = "product" 
GROUP BY location`,
    },
    {
        label: "Products grouped by category with count > 2",
        query: `SELECT category, COUNT(*) AS productCount 
FROM _default 
WHERE documentType = "product" 
GROUP BY category 
HAVING COUNT(*) > 2`,
    },
    {
        label: "Top 5 most expensive products",
        query: `SELECT name, price 
FROM _default 
WHERE documentType = "product" 
ORDER BY price DESC 
LIMIT 5`,
    },
    {
        label: "Products created after 2024-01-01",
        query: `SELECT name, createdOn 
FROM _default 
WHERE documentType = "product" 
  AND createdOn > "2024-01-01T00:00:00.000Z"`,
    },
    {
        label: "Products sorted by quantity (descending)",
        query: `SELECT name, quantity 
FROM _default 
WHERE documentType = "product" 
ORDER BY quantity DESC`,
    },
];

const SqlPlusPlusPage: React.FC = () => {
    const { databases } = useContext(DatabaseContext)!;
    const [databaseName, setDatabaseName] = useState<string>("");
    const [resultsMessage, setResultsMessage] = useState<string[]>([]);
    const [hasDocuments, setHasDocuments] = useState<boolean>(true);
    const editorRef = useRef(null);


    useEffect(() => {
        checkDocuments();
    }, [databaseName]);

    async function checkDocuments() {
        if (!(databaseName in databases)) {
            setHasDocuments(false);
            return;
        }

        const database = databases[databaseName];
        if (!database) {
            setHasDocuments(false);
            return;
        }

        try {
            const query = database.createQuery(`SELECT COUNT(*) AS docCount FROM _default`);
            const resultSet = await query.execute();
            if (resultSet[0].docCount > 0) {
                setHasDocuments(true);
                return;
            }
            setHasDocuments(false);

        } catch (e) {
            console.error("Error checking documents:", e);
            setHasDocuments(false);
        }
    }

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    function setEditorQuery(query: string) {
        if (editorRef.current) {
            editorRef.current.setValue(query);
        }
    }

    async function update() {
        setResultsMessage([]);

        if (!(databaseName in databases)) {
            setResultsMessage([`${new Date().toISOString()} Error: Database is not setup (defined)`]);
            return;
        }

        const database = databases[databaseName];
        if (!database) {
            setResultsMessage([`${new Date().toISOString()} Error: Database is null)`]);
            return;
        }

        const queryString = editorRef.current?.getValue();
        if (!queryString) {
            setResultsMessage([`${new Date().toISOString()} Error: Query string is empty or invalid`]);
            return;
        }

        try {
            const query = database.createQuery(queryString);
            const resultSet = await query.execute();

            for (const result of resultSet) {
                setResultsMessage((prev) => [
                    ...prev,
                    `${new Date().toISOString()} Result: ` + JSON.stringify(result),
                ]);
            }
        } catch (e) {
            setResultsMessage([`${new Date().toISOString()} Error: ${e}`]);
        }
    }

    function reset() {
        setDatabaseName("");
        setResultsMessage([]);
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
            titleButtons={undefined}
        >
            <>
                {!hasDocuments && (
                    <div style={{ padding: "10px", backgroundColor: "#fff3cd", border: "1px solid #ffeeba", borderRadius: "5px", marginBottom: "15px" }}>
                        <p style={{ margin: 0, color: "#856404" }}>
                            No documents found in the database. Please create documents using the <strong>Create Batch</strong> functionality.
                        </p>
                        <Link
                            to="/documents/batch/create"
                            style={{
                                display: "inline-block",
                                marginTop: "10px",
                                padding: "10px 15px",
                                backgroundColor: "#007bff",
                                color: "#fff",
                                textDecoration: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            Go to Create Batch
                        </Link>
                    </div>
                )}
                <div className="pt-2 pb-2">
                    <Editor
                        onMount={handleEditorDidMount}
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
                <IonItemDivider>
                    <IonLabel>Example Queries</IonLabel>
                </IonItemDivider>
                <div style={{ padding: "10px" }}>
                    <select
                        defaultValue=""
                        onChange={(e) => setEditorQuery(e.target.value)}
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
                            <option key={index} value={example.query}>
                                {example.label}
                            </option>
                        ))}
                    </select>
                </div>
            </>
        </DetailPageContainerRun>
    );
};

export default SqlPlusPlusPage;