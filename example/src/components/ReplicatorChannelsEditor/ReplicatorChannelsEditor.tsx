// ReplicatorChannelsEditorForm.tsx
import React from 'react';

import { IonItem, IonInput, IonLabel } from '@ionic/react';

interface ReplicatorChannelsEditorProps {
    channels: string;
    setChannels: (arg: string) => void;
}

const ReplicatorChannelsEditorForm: React.FC<ReplicatorChannelsEditorProps> =
    ({
        channels,
        setChannels,
    }) => {

        return (
            <>
                <IonItem key="channel-label-item-key">
                    <IonLabel key="channel-label-key">Channels (comma delimited)</IonLabel>
                </IonItem>
                <IonItem key="channel-new-item" className="mt-5">
                    <IonInput
                        key="channel-new-input"
                        value={channels}
                        onIonInput={(e: any) => setChannels(e.target.value)}
                    >
                    </IonInput>
                </IonItem>
            </>
        );
    };
export default ReplicatorChannelsEditorForm;
