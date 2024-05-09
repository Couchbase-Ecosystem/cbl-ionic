// AuthenticationBasicForm.tsx
import React from 'react';
import {
    IonItem,
    IonInput,
    IonLabel,
    IonSelect,
    IonSelectOption,
} from '@ionic/react';

interface ContainerProps {
    selectedAuthenticationType: string;
    setSelectedAuthenticationType: (arg: string) => void;
    username: string;
    setUsername: (arg: string) => void;
    password: string;
    setPassword: (arg: string) => void;
    sessionId: string;
    setSessionId: (arg: string) => void;
    cookieName: string;
    setCookieName: (arg: string) => void;
}

const AuthenticationTwoFieldForm: React.FC<ContainerProps> =
    ({
         selectedAuthenticationType,
         setSelectedAuthenticationType,
         username,
         setUsername,
         password,
         setPassword,
         sessionId,
         setSessionId,
         cookieName,
         setCookieName,
     }) => {
        return (
            <>
                <IonItem key="authentication-selection-item-key">
                    <IonLabel key="authentication-select-label-key">Authentication Type</IonLabel>
                    <IonSelect
                        key='authentication-type-select-key'
                        value={selectedAuthenticationType}
                        onIonChange={e => setSelectedAuthenticationType(e.detail.value)}
                    >
                        <IonSelectOption key='selectoption-basic' value="basic">
                            Basic
                        </IonSelectOption>
                        <IonSelectOption key='selectoption-session-key' value="session">
                            Session
                        </IonSelectOption>
                    </IonSelect>
                </IonItem>
                {selectedAuthenticationType === 'basic' ?
                    <>
                        <IonItem key="username-item-key">
                            <IonLabel key="username-label-key">Username</IonLabel>
                            <IonInput key="username-input-key"
                                      onIonChange={(e: any) => setUsername(e.target.value)}
                            >{username}</IonInput>
                        </IonItem>
                        <IonItem key="password-item-key">
                            <IonLabel key="password-label-key">Password</IonLabel>
                            <IonInput key="password-input-key"
                                      onIonChange={(e: any) => setPassword(e.target.value)}
                            >{password}</IonInput>
                        </IonItem>
                    </> : null}

                {selectedAuthenticationType === 'session' ?
                    <>
                        <IonItem key="session-id-item-key">
                            <IonLabel key="session-id-label-key">Session Id</IonLabel>
                            <IonInput key="session-id-input-key"
                                      onIonChange={(e: any) => setSessionId(e.target.value)}
                            >{sessionId}</IonInput>
                        </IonItem>
                        <IonItem key="cookie-name-item-key">
                            <IonLabel key="cookie-name-label-key">Cookie Name</IonLabel>
                            <IonInput key="cookie-name-input-key"
                                      onIonChange={(e: any) => setCookieName(e.target.value)}
                            >{cookieName}</IonInput>
                        </IonItem>
                    </> : null}
            </>
        );
    };
export default AuthenticationTwoFieldForm;
