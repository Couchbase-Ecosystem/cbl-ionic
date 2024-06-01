// EditDocument.tsx
import React, {useState, useContext, useEffect} from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageDatabaseCollectionRun
    from '../../components/DetailPageDatabaseCollectionRun/DetailPageDatabaseCollectionRun';
import {DataGeneratorService, WidgetType} from '../../services/DataGeneratorService';

import {
    IonItemDivider,
    IonItem,
    IonInput,
    IonLabel,
    IonSelect,
    IonSelectOption,
} from '@ionic/react';

import {MutableDocument, Blob} from 'cbl-ionic';

const EditDocumentPage: React.FC = () => {
        //database stuff
        const {databases} = useContext(DatabaseContext)!;
        const [databaseName, setDatabaseName] = useState<string>('');
        const [collectionName, setCollectionName] = useState<string>('');
        const [scopeName, setScopeName] = useState<string>('');
        //document stuff
        const [documentId, setDocumentId] = useState<string>('');
        const [document, setDocument] = useState<string>('');
        //results stuff
        const [resultsMessage, setResultsMessage] = useState<string[]>([]);
        //select list - generated data
        const [selectKey, setSelectKey] = useState(0);
        const [selectedDocument, setSelectedDocument] = useState<string>();
        const [dictionary, setDictionary] = useState<{ [key: string]: string }>({});
        const [data, setData] = useState<{ [key: number]: WidgetType }>();

        useEffect(() => {
            const ds = new DataGeneratorService();
            const data = ds.dictionaryDocs;
            const newDictionary: { [key: string]: string } = {};
            for (const key in data) {
                newDictionary[key] = (data[key].blob != null) ? data[key].id + ' - blob : ' + data[key].doc.name : data[key].id + ' : ' + data[key].doc.name;
            }
            //set both the raw data and the dictionary to pick a document from
            setData(data);
            setDictionary(newDictionary);//update the state
        }, []);


        function reset() {
            setDatabaseName('');
            setScopeName('');
            setCollectionName('');
            setDocumentId('');
            setDocument('');
            setSelectKey(selectKey => selectKey + 1);
            setSelectedDocument(undefined);
            setResultsMessage([]);
        }

        async function update() {
            if (databaseName in databases) {
                try {
                    const database = databases[databaseName];
                    const collection = await database.collection(collectionName, scopeName);
                    if (database != null && collection != null) {
                        //create a mutable document to save into the database
                        const doc = new MutableDocument(documentId);
                        doc.setData(JSON.parse(document));
                        //check if there is a blob to set
                        if (selectedDocument !== undefined && data !== undefined) {
                            const key = parseInt(selectedDocument);
                            const selectedData = data[key];
                            if (selectedData.blob != null) {
                                const abBlob = DataGeneratorService.getBlobFromBase64(selectedData.blob);
                                if (abBlob != null) {
                                    const blob = new Blob("image/jpeg", abBlob);
                                    doc.setBlob('image', blob);
                                }
                            }
                        }
                        await collection.save(doc)
                        const newDoc = await collection.document(documentId);
                        if (newDoc != null && documentId == newDoc.getId()) {
                            setResultsMessage(prev => [...prev, 'Document Created']);
                        } else {
                            const message = `${new Date().toISOString()} Error: Id not found in _documents ` + documentId;
                            setResultsMessage(prev => [...prev, message]);
                        }
                    }
                } catch (error) {
                    setResultsMessage(prev => [...prev, error]);
                }
            } else {
                setResultsMessage(prev => [...prev, `${new Date().toISOString()} Error: Database is not setup (defined)`]);
            }
        }

        return (
            <DetailPageDatabaseCollectionRun
                navigationTitle="Document Editor"
                collapseTitle="Document Editor"
                onReset={reset}
                onAction={update}
                results={resultsMessage}
                databaseName={databaseName}
                setDatabaseName={setDatabaseName}
                scopeName={scopeName}
                setScopeName={setScopeName}
                collectionName={collectionName}
                setCollectionName={setCollectionName}
                sectionTitle="Document Information"
                titleButtons={undefined}>
                <IonItem key={1}>
                    <IonInput
                        onInput={(e: any) => setDocumentId(e.target.value)}
                        placeholder="Document ID"
                        value={documentId}
                    ></IonInput>
                </IonItem>
                <IonItem key={2} lines="full">
                    <IonLabel position="stacked">Document</IonLabel>
                    <textarea
                        style={{width: '100%', padding: '16px 0px'}}
                        rows={4}
                        value={document}
                        onChange={(e: any) => setDocument(e.detail.value)}
                        placeholder="{ 'message': 'hello world' }">
          </textarea>
                </IonItem>
                <IonItemDivider>
                    <IonLabel>Generated Data</IonLabel>
                </IonItemDivider>
                <IonItem key={3}>
                    <IonSelect
                        key={selectKey}
                        placeholder='Generated Documents'
                        value={selectedDocument}
                        onIonChange={e => {
                            const key = e.detail.value;
                            if (data !== null && data !== undefined) {
                                setSelectedDocument(key);
                                setDocumentId(data[key].id)
                                setDocument(JSON.stringify(data[key].doc));
                            }
                        }
                        }>
                        {Object.entries(dictionary).map(([key, value]) => (
                            <IonSelectOption value={key}>{value}</IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>
            </DetailPageDatabaseCollectionRun>
        );
    }
;

export default EditDocumentPage;