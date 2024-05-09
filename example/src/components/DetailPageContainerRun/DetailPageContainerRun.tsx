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
    IonContent, IonItem,
} from '@ionic/react';

import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';

interface ContainerProps {
    navigationTitle: string;
    collapseTitle: string;
    onReset: () => void;
    onAction: () => void;
    databaseName: string;
    setDatabaseName: (name: string) => void;
    sectionTitle: string;
    titleButtons: React.ReactNode | undefined;
    children: React.ReactNode;
    results: string[];
}

const DetailPageContainerRun: React.FC<ContainerProps> =
    ({
         navigationTitle,
         collapseTitle,
         onReset,
         onAction,
         databaseName,
         setDatabaseName,
         sectionTitle,
         titleButtons,
         children,
         results,
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
                        <DatabaseNameForm
                            setDatabaseName={setDatabaseName}
                            databaseName={databaseName}
                        />
                        <IonItemDivider key="section-divider-key">
                            <IonLabel key="section-divider-label-key">{sectionTitle}</IonLabel>
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
export default DetailPageContainerRun;
