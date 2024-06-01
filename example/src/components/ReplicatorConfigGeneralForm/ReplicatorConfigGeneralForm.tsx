// ReplicatorConfigGeneralForm.tsx
import React from 'react';

import {
    IonInput,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonToggle
} from '@ionic/react';

import {ReplicatorType} from 'cbl-ionic';

export type ReplicatorConfigGeneralFormType = {
    connectionString: string;
    setConnectionString: (arg: string) => void;
    headers: string;
    setHeaders: (arg: string) => void;
    heartbeat: number;
    setHeartbeat: (arg: number) => void;
    maxAttempts: number;
    setMaxAttempts: (arg: number) => void;
    maxAttemptWaitTime: number;
    setMaxAttemptWaitTime: (arg: number) => void;
    selectedReplicatorType: string;
    setSelectedReplicatorType: (arg: string) => void;
    continuous: boolean;
    setContinuous: (arg: boolean) => void;
    autoPurgeEnabled: boolean;
    setAutoPurgeEnabled: (arg: boolean) => void;
    acceptParentDomainCookies: boolean;
    setAcceptParentDomainCookies: (arg: boolean) => void;
};

const ReplicatorConfigGeneralForm: React.FC<ReplicatorConfigGeneralFormType> =
    ({
         connectionString,
         setConnectionString,
         headers,
         setHeaders,
         heartbeat,
         setHeartbeat,
         maxAttempts,
         setMaxAttempts,
         maxAttemptWaitTime,
         setMaxAttemptWaitTime,
         selectedReplicatorType,
         setSelectedReplicatorType,
         continuous,
         setContinuous,
         autoPurgeEnabled,
         setAutoPurgeEnabled,
         acceptParentDomainCookies,
         setAcceptParentDomainCookies
     }) => {
        return (
            <>
                <IonItem key={'connection-string-item-key'}>
                    <IonTextarea
                        key={'connection-string-textarea-key'}
                        rows={3}
                        placeholder="Connection String"
                        onInput={(e: any) => setConnectionString(e.target.value)}
                        value={connectionString}
                    ></IonTextarea>
                </IonItem>
                <IonItem key={'headers-string-item-key'}>
                    <IonTextarea
                        key={'headers-string-textarea-key'}
                        rows={3}
                        placeholder="Extra HTTP headers to send in all requests (JSON)"
                        onInput={(e: any) => setHeaders(e.target.value)}
                        value={headers}
                    ></IonTextarea>
                </IonItem>
                <IonItem key={'heartbeat-item-key'}>
                    <IonLabel position="stacked" key={'heartbeat-label-key'}>
                        Heartbeat (in seconds)
                    </IonLabel>
                    <IonInput
                        key={'heartbeat-input-key'}
                        type="number"
                        onInput={(e: any) => setHeartbeat(e.target.value)}
                        value={heartbeat}
                    ></IonInput>
                </IonItem>
                <IonItem key={'max-attempts-item-key'}>
                    <IonLabel position="stacked" key={'max-attempts-label-key'}>
                        Max Attempts (0 restores default behavior)
                    </IonLabel>
                    <IonInput
                        key={'max-attempts-input-key'}
                        type="number"
                        onInput={(e: any) => setMaxAttempts(e.target.value)}
                        value={maxAttempts}
                    ></IonInput>
                </IonItem>
                <IonItem key={'max-attempt-wait-time-item-key'}>
                    <IonLabel position="stacked" key={'max-attempt-wait-time-label-key'}>
                        Max Attempt Wait Time (in seconds)
                    </IonLabel>
                    <IonInput
                        key={'max-attempt-wait-time-input-key'}
                        type="number"
                        onInput={(e: any) => setMaxAttemptWaitTime(e.target.value)}
                        value={maxAttemptWaitTime}
                    ></IonInput>
                </IonItem>
                <IonItem key={'replicatortype-item-key'}>
                    <IonLabel key={'replicator-type-label-key'}>Replicator Type</IonLabel>
                    <IonSelect
                        key={'replicator-type-select-key'}
                        value={selectedReplicatorType}
                        onIonChange={e => setSelectedReplicatorType(e.detail.value)}
                    >
                        {Object.entries(ReplicatorType).map(([key, value]) => (
                            <IonSelectOption key={'select-option' + value} value={key}>
                                {value}
                            </IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>
                <IonItem key={'continuous-item-key'}>
                    <IonToggle
                        key={'continuous-toggle-key'}
                        onIonChange={(e: any) => setContinuous(e.detail.checked)}
                        checked={continuous}
                    >
                        Continuous
                    </IonToggle>
                </IonItem>
                <IonItem key={'auto-purge-item-key'}>
                    <IonToggle
                        key={'auto-purge-toggle-key'}
                        onIonChange={(e: any) => setAutoPurgeEnabled(e.detail.checked)}
                        checked={autoPurgeEnabled}
                    >
                        Auto Purge Enabled
                    </IonToggle>
                </IonItem>
                <IonItem key={'accept-parent-domain-cookies-item-key'}>
                    <IonToggle
                        key={'accept-parent-domain-cookies-toggle-key'}
                        onIonChange={(e: any) => setAcceptParentDomainCookies(e.detail.checked)}
                        checked={acceptParentDomainCookies}
                    >
                        Accept Parent Domain Cookies
                    </IonToggle>
                </IonItem>
            </>
        );
    };

export default ReplicatorConfigGeneralForm;
