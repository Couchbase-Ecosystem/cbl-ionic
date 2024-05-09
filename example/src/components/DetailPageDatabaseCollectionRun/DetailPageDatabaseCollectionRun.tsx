import React from 'react';
import {
    IonButtons,
    IonButton,
    IonMenuButton,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonLabel,
    IonItemGroup,
    IonItemDivider,
    IonContent,
    IonItem,
} from '@ionic/react';

import DatabaseCollectionForm from '../DatabaseCollectionForm/DatabaseCollectionForm';

interface ContainerProps {
    navigationTitle: string;
    collapseTitle: string;
    sectionTitle: string,
    titleButtons: React.ReactNode | undefined;
    onReset: () => void;
    onAction: () => void;
    databaseName: string;
    setDatabaseName: (name: string) => void;
    scopeName: string;
    setScopeName: (name: string) => void;
    collectionName: string;
    setCollectionName: (name: string) => void;
    results: string[];
    children: React.ReactNode;
}


const DetailPageDatabaseCollectionRun: React.FC<ContainerProps> =
    ({
         navigationTitle,
         collapseTitle,
         titleButtons,
         sectionTitle,
         onReset,
         onAction,
         databaseName,
         setDatabaseName,
         scopeName,
         setScopeName,
         collectionName,
         setCollectionName,
         results,
         children
     }) => {
        return (
            <IonPage key="page-key">
                <IonHeader key="header-key">
                    <IonToolbar key="toolbar-key">
                        <IonButtons slot="start" key="menu-buttons-key">
                            <IonMenuButton/>
                        </IonButtons>
                        <IonTitle key="title-key">{collapseTitle}</IonTitle>
                        <IonButtons slot="end" key="right-side-buttons-key">
                            <IonButton onClick={onReset} key="button-reset-key">
                                <i className="fa-duotone fa-arrows-rotate"></i>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen key="main-content-key">
                    <IonHeader collapse="condense" key="main-content-header-key">
                        <IonToolbar key="main-content-toolbar-key">
                            <IonTitle size="large" key="title-key">{navigationTitle}</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonList key="main-list-key">
                        <DatabaseCollectionForm
                            databaseName={databaseName}
                            setDatabaseName={setDatabaseName}
                            scopeName={scopeName}
                            setScopeName={setScopeName}
                            collectionName={collectionName}
                            setCollectionName={setCollectionName}>
                        </DatabaseCollectionForm>
                        <IonItemDivider key="section-divider-key">
                            <IonLabel key="section-label-key">{sectionTitle}</IonLabel>
                            <IonButtons slot="end" key="section-divider-buttons-key">
                                {titleButtons}
                                <IonButton
                                    key="button-action"
                                    onClick={onAction}
                                    style={{
                                        display: 'block',
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                        padding: '0px 2px 0px 25px',
                                    }}
                                >
                                    <i className="fa-duotone fa-play"></i>
                                </IonButton>
                            </IonButtons>
                        </IonItemDivider>
                        {children}
                        <IonItemGroup class="mt-4 mb-60" key="item-group-results-key">
                            <IonItemDivider key="item-results-divider-key">
                                <IonLabel key="item-results-label-key">Results</IonLabel>
                            </IonItemDivider>
                            {results.map((result, index) => (
                                <IonItem key={'result-item-' + index}>
                                    <IonLabel key={'result-label-' + index}>{result}</IonLabel>
                                </IonItem>
                            ))}
                        </IonItemGroup>
                    </IonList>
                </IonContent>
            </IonPage>
        );
    };
export default DetailPageDatabaseCollectionRun;
