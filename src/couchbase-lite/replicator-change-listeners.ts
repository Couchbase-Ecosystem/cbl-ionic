import {
    IonicCouchbaseLitePlugin,
} from '../definitions';

import {
    EngineLocator,
    ICoreEngine,
    Replicator,
    ReplicatorChangeListener,
} from 'cblite';

export class ReplicatorChangeListeners {
    //manage talking to the native bridge
    private _engine: ICoreEngine = EngineLocator.getEngine(EngineLocator.key);
    private _platformEngine = this._engine as IonicCouchbaseLitePlugin;

    private _replicator: Replicator;

    //manage tokens
    private _changeListenerToken: string;
    private _documentListenerToken: string;

    //manage state of listeners
    private _didStartListener = false;
    private _didStartDocumentListener = false;

    private _replicatorChangeListenerTokens: { [key: string]: ReplicatorChangeListener } = {};
    private _replicatorDocumentListenerTokens: { [key: string]: ReplicatorChangeListener } = {};

    constructor(replicator: Replicator) {
        this._replicator = replicator;
    }

    getReplicatorChangeListenerToken(): string {
        return this._changeListenerToken;
    }

    getReplicatorDocumentListenerToken(): string {
        return this._documentListenerToken;
    }

    async addChangeListener(listener: ReplicatorChangeListener) {
        const replicatorId = this._replicator.getId();
        this._replicatorChangeListenerTokens[replicatorId] = listener;
        if (!this._didStartListener){
            await this._platformEngine.replicator_AddChangeListener(
                {
                    replicatorId: replicatorId
                },
                (data: any, err: any) => {
                    if (err) {
                        console.log('Replicator change listener error', err);
                        return;
                    }
                    this.notifyReplicatorChangeListeners(data);
                },
            );
            this._didStartListener = true;
        }
    }
    async removeChangeListener() {
        const replicatorId = this._replicator.getId();
        delete this._replicatorChangeListenerTokens[replicatorId];

    }

    private notifyReplicatorChangeListeners(data: any) {
        const replicatorId = this._replicator.getId();
        const changeListener = this._replicatorChangeListenerTokens[replicatorId];
        changeListener(data);
    }


}