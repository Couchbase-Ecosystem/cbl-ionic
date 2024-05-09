// DetailPageContainer.tsx
import './DetailPageContainerBase.css';
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
    IonContent
}
    from '@ionic/react';

interface ContainerProps {
    navigationTitle: string;
    collapseTitle: string;
    onReset: () => void;
    onAction: () => void;
    actionLabel: string;
    children: React.ReactNode;
    resultsChildren: React.ReactNode;
}

const DetailPageContainer: React.FC<ContainerProps> =
    ({
         navigationTitle,
         collapseTitle,
         onReset,
         onAction,
         actionLabel,
         children,
         resultsChildren
     }) => {
        return (
            <IonPage key="page-key">
                <IonHeader key="page-header-key">
                    <IonToolbar key="page-header-toolbar-key">
                        <IonButtons slot="start" key="page-header-left-toolbar-buttons-key">
                            <IonMenuButton/>
                        </IonButtons>
                        <IonTitle key="page-header-title-key">{collapseTitle}</IonTitle>
                        <IonButtons slot="end" key="page-header-right-toolbar-buttons-key">
                            <IonButton onClick={onReset} key="page-header-reset-button-key">
                                <i className="fa-duotone fa-arrows-rotate"></i>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen key="main-content-key">
                    <IonHeader collapse="condense" key="main-content-header-key">
                        <IonToolbar key="main-content-header-toolbar-key">
                            <IonTitle key="main-content-header-title-key" size="large">{navigationTitle}</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonList key="main-content-list-key">
                        {children}
                        {actionLabel !== "" ? (
                            <>
                                <IonButton
                                    key="main-content-action-button-key"
                                    onClick={onAction}
                                    style={{
                                        display: 'block',
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                        padding: '20px 80px',
                                    }}
                                >
                                    {actionLabel}
                                </IonButton>
                                <IonItemGroup key="main-content-results-item-group-key">
                                    <IonItemDivider key="main-content-results-divider-key">
                                        <IonLabel key="main-content-results-label-key">Results</IonLabel>
                                    </IonItemDivider>
                                    {resultsChildren}
                                </IonItemGroup>
                            </>
                        ) : null}
                    </IonList>
                </IonContent>
            </IonPage>
        )
    };
export default DetailPageContainer;