//ReplicatorCertificationForm.tsx

import {IonItem, IonTextarea, IonToggle} from "@ionic/react";
import React from "react";
import ReplicatorChannelsEditorForm from "../ReplicatorChannelsEditor/ReplicatorChannelsEditor";

interface ReplicatorCertificationFormProps {
    acceptSelfSignedCertOnly: boolean;
    setAcceptSelfSignedCertOnly: (arg: boolean) => void;
    pinnedServerCertBase64: string;
    setPinnedServerCertBase64: (arg: string) => void;
}

const ReplicatorCertificationForm:
    React.FC<ReplicatorCertificationFormProps> =
    ({
         acceptSelfSignedCertOnly,
         setAcceptSelfSignedCertOnly,
         pinnedServerCertBase64,
         setPinnedServerCertBase64,
     }) => {

        return (
            <>
                <IonItem key={'self-cert-item-key'}>
                    <IonToggle
                        key={'self-cert-toggle-key'}
                        onIonChange={(e: any) => setAcceptSelfSignedCertOnly(e.detail.checked)}
                        checked={acceptSelfSignedCertOnly}>
                        Accept Only Self-Signed Certs
                    </IonToggle>
                </IonItem>
                <IonItem key={'pinned-cert-base64-string-item-key'}>
                    <IonTextarea
                        key={'pinned-cert-base64-string-textarea-key'}
                        rows={8}
                        placeholder="Pinned Certificate (base64)"
                        onInput={(e: any) => setPinnedServerCertBase64(e.target.value)}
                        value={pinnedServerCertBase64}
                    ></IonTextarea>
                </IonItem>
            </>
        )
    };

export default ReplicatorCertificationForm;
