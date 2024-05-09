// DetailPageContainerItemResult.tsx
import './DetailPageContainerItemResults.css';

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
    IonContent,
    IonItemGroup,
    IonItemDivider,
    IonLabel
}
    from '@ionic/react';

interface ContainerProps {
    navigationTitle: string;
    collapseTitle: string;
    onReset: () => void;
    resultsCount: string;
    children: React.ReactNode;
    resultsChildren: React.ReactNode;
}

const DetailPageContainerItemResults: React.FC<ContainerProps> =
    ({
         navigationTitle,
         collapseTitle,
         onReset,
         resultsCount,
         children,
         resultsChildren
     }) => {

        return (
            <IonPage key="page-key">
                <IonHeader key="page-header-key">
                    <IonToolbar key="page-header-toolbar-key">
                        <IonButtons slot="start" key="page-header-toolbar-left-buttons-key">
                            <IonMenuButton/>
                        </IonButtons>
                        <IonTitle key="page-header-title-key">{collapseTitle}</IonTitle>
                        <IonButtons slot="end" key="page-header-toolbar-right-buttons-key">
                            <IonButton onClick={onReset} key="page-header-toolbar-reset-button-key">
                                <i className="fa-duotone fa-arrows-rotate"></i>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen key="main-content-key">
                    <IonHeader collapse="condense" key="main-content-header-key">
                        <IonToolbar key="main-content-header-toolbar-key">
                            <IonTitle size="large" key="main-content-header-title-key">{navigationTitle}</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonList key="main-content-list-key">
                        {children}
                        <IonItemGroup class="mt-4" key="main-content-results-item-group-key">
                            <IonItemDivider key="main-content-results-divider-key">
                                <IonLabel key="main-content-results-label-count-key">Results {resultsCount}</IonLabel>
                            </IonItemDivider>
                            {resultsChildren}
                        </IonItemGroup>
                    </IonList>
                </IonContent>
            </IonPage>
        )
    };
export default DetailPageContainerItemResults;