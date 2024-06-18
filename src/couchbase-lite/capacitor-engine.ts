/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Collection,
  CollectionArgs,
  CollectionChangeListenerArgs,
  CollectionCreateIndexArgs,
  CollectionDeleteDocumentArgs,
  CollectionDeleteIndexArgs,
  CollectionDocumentExpirationArgs,
  CollectionDocumentGetBlobContentArgs,
  CollectionDocumentSaveResult,
  CollectionGetDocumentArgs,
  CollectionPurgeDocumentArgs,
  CollectionSaveArgs,
  CollectionsResult,
  DatabaseArgs,
  DatabaseCopyArgs,
  DatabaseCreateIndexArgs,
  DatabaseDeleteDocumentArgs,
  DatabaseDeleteIndexArgs,
  DatabaseExistsArgs,
  DocumentChangeListenerArgs,
  DocumentExpirationResult,
  DocumentGetBlobContentArgs,
  DatabaseGetDocumentArgs,
  DatabaseOpenArgs,
  DatabasePerformMaintenanceArgs,
  DatabasePurgeDocumentArgs,
  DatabaseSaveArgs,
  DatabaseSetFileLoggingConfigArgs,
  DatabaseSetLogLevelArgs,
  DocumentResult,
  EngineLocator,
  ListenerCallback,
  ListenerHandle,
  QueryChangeListenerArgs,
  QueryExecuteArgs,
  QueryRemoveChangeListenerArgs,
  Result,
  ReplicatorCreateArgs,
  ReplicatorArgs,
  ReplicatorStatus,
  Scope,
  ScopeArgs,
  ScopesResult, ReplicationChangeListenerArgs, ReplicatorCollectionArgs,
  DatabaseEncryptionKeyArgs,
} from '../cblite-js/cblite';

import { IonicCouchbaseLite } from '../ionic-couchbase-lite';
import { IonicCouchbaseLitePlugin } from '../definitions';

export class CapacitorEngine implements IonicCouchbaseLitePlugin {
  _defaultCollectionName = '_default';
  _defaultScopeName = '_default';

  constructor(config: any = {}) {
    EngineLocator.registerEngine(EngineLocator.key, this);
    this.plugin_Configure(config);
  }

  collection_AddChangeListener(
      args: CollectionChangeListenerArgs,
      cb: ListenerCallback
  ): Promise<ListenerHandle> {
    return IonicCouchbaseLite.collection_AddChangeListener(
        {
          name: args.name,
          scopeName: args.scopeName,
          collectionName: args.collectionName,
          changeListenerToken: args.changeListenerToken,
        },
        cb
    );
  }

  collection_AddDocumentChangeListener(
      args: DocumentChangeListenerArgs,
      cb: ListenerCallback
  ): Promise<ListenerHandle> {
    return IonicCouchbaseLite.collection_AddDocumentChangeListener(
        {
          name: args.name,
          scopeName: args.scopeName,
          collectionName: args.collectionName,
          changeListenerToken: args.changeListenerToken,
          documentId: args.documentId,
        },
        cb
    );
  }

  async collection_CreateCollection(args: CollectionArgs): Promise<Collection> {
    return IonicCouchbaseLite.collection_CreateCollection(args);
  }

  async collection_CreateIndex(args: CollectionCreateIndexArgs): Promise<void> {
    return IonicCouchbaseLite.collection_CreateIndex(args);
  }

  async collection_DeleteCollection(args: CollectionArgs): Promise<void> {
    return IonicCouchbaseLite.collection_DeleteCollection(args);
  }

  async collection_DeleteDocument(args: CollectionDeleteDocumentArgs): Promise<void> {
    return IonicCouchbaseLite.collection_DeleteDocument(args);
  }

  async collection_DeleteIndex(args: CollectionDeleteIndexArgs): Promise<void> {
    return IonicCouchbaseLite.collection_DeleteIndex(args);
  }

  async collection_GetCollections(args: ScopeArgs): Promise<CollectionsResult> {
    return IonicCouchbaseLite.collection_GetCollections(args);
  }

  async collection_GetCollection(args: CollectionArgs): Promise<Collection> {
    return IonicCouchbaseLite.collection_GetCollection(args);
  }

  async collection_GetCount(args: CollectionArgs): Promise<{ count: number }> {
    return IonicCouchbaseLite.collection_GetCount(args);
  }

  async collection_GetDefault(args: DatabaseArgs): Promise<Collection> {
    return IonicCouchbaseLite.collection_GetDefault(args);
  }

  async collection_GetDocument(args: CollectionGetDocumentArgs)
      : Promise<DocumentResult> {
    return IonicCouchbaseLite.collection_GetDocument(args);
  }

  async collection_GetDocumentExpiration(args: CollectionGetDocumentArgs): Promise<DocumentExpirationResult> {
    return IonicCouchbaseLite.collection_GetDocumentExpiration(args);
  }

  async collection_GetBlobContent(
      args: CollectionDocumentGetBlobContentArgs
  ) : Promise<{data: ArrayBuffer}> {
    const data = await IonicCouchbaseLite.collection_GetBlobContent(args);
    return {data: new Uint8Array(data.data).buffer};
  }

  async collection_GetIndexes(
      args: CollectionArgs
  ): Promise<{ indexes: string[] }> {
    return IonicCouchbaseLite.collection_GetIndexes(args);
  }

  async collection_PurgeDocument(args: CollectionPurgeDocumentArgs): Promise<void> {
    return IonicCouchbaseLite.collection_PurgeDocument(args);
  }

  async collection_RemoveChangeListener(
      args: CollectionChangeListenerArgs
  ): Promise<void> {
    return IonicCouchbaseLite.collection_RemoveChangeListener(args);
  }

  async collection_RemoveDocumentChangeListener(
      args: CollectionChangeListenerArgs
  ): Promise<void> {
    return IonicCouchbaseLite.collection_RemoveChangeListener(args);
  }

  async collection_Save(
      args: CollectionSaveArgs
  ): Promise<CollectionDocumentSaveResult> {
    return IonicCouchbaseLite.collection_Save(args);
  }

  async collection_SetDocumentExpiration(args: CollectionDocumentExpirationArgs): Promise<void> {
    return IonicCouchbaseLite.collection_SetDocumentExpiration(args);
  }

  async database_Close(args: DatabaseArgs): Promise<void> {
    return IonicCouchbaseLite.database_Close(args);
  }

  async database_Copy(args: DatabaseCopyArgs): Promise<void> {
    return IonicCouchbaseLite.database_Copy(args);
  }

  async database_ChangeEncryptionKey(args: DatabaseEncryptionKeyArgs): Promise<void> {
    return IonicCouchbaseLite.database_ChangeEncryptionKey(args); 
  }

  /**
   * @deprecated This function will be removed in future versions. Use colllection_CreateIndex instead.
   */
  async database_CreateIndex(args: DatabaseCreateIndexArgs): Promise<void> {
    const colArgs: CollectionCreateIndexArgs = {
      name: args.name,
      collectionName: this._defaultCollectionName,
      scopeName: this._defaultScopeName,
      indexName: args.indexName,
      index: args.index,
    };
    return IonicCouchbaseLite.collection_CreateIndex(colArgs);
  }

  async database_Delete(args: DatabaseArgs): Promise<void> {
    return IonicCouchbaseLite.database_Delete(args);
  }

  /**
   * @deprecated This will be removed in future versions. Use collection_GetCount instead.
   */
  async database_DeleteDocument(
      args: DatabaseDeleteDocumentArgs
  ): Promise<void> {
    const colArgs:CollectionDeleteDocumentArgs = {
      name: args.name,
      collectionName: this._defaultCollectionName,
      scopeName: this._defaultScopeName,
      docId: args.docId,
      concurrencyControl: args.concurrencyControl,
    };
    return IonicCouchbaseLite.collection_DeleteDocument(colArgs);
  }

  /**
   * @deprecated This function will be removed in future versions. Use colllection_CreateIndex instead.
   */
  async database_DeleteIndex(args: DatabaseDeleteIndexArgs): Promise<void> {
    const colArgs: CollectionDeleteIndexArgs = {
      name: args.name,
      collectionName: this._defaultCollectionName,
      scopeName: this._defaultScopeName,
      indexName: args.indexName,
    };
    return IonicCouchbaseLite.collection_DeleteIndex(colArgs);
  }

  async database_Exists(
      args: DatabaseExistsArgs
  ): Promise<{ exists: boolean }> {
    return IonicCouchbaseLite.database_Exists(args);
  }

  /**
   * @deprecated This will be removed in future versions. Use collection_GetCount instead.
   */
  async database_GetCount(args: DatabaseArgs): Promise<{ count: number }> {
    const colArgs:CollectionArgs = {
      name: args.name,
      collectionName: this._defaultCollectionName,
      scopeName: this._defaultScopeName,
    };
    return IonicCouchbaseLite.collection_GetCount(colArgs);
  }

  /**
   * @deprecated This will be removed in future versions. Use collection_GetCount instead.
   */
  async database_GetDocument(
      args: DatabaseGetDocumentArgs
  ): Promise<DocumentResult> {
    const colArgs:CollectionGetDocumentArgs = {
      name: args.name,
      collectionName: this._defaultCollectionName,
      scopeName: this._defaultScopeName,
      docId: args.docId,
    };
    return IonicCouchbaseLite.collection_GetDocument(colArgs);
  }

  /**
   * @deprecated This function will be removed in future versions. Use colllection_CreateIndex instead.
   */
  async database_GetIndexes(
      args: DatabaseArgs
  ): Promise<{ indexes: string[] }> {
    const colArgs: CollectionArgs = {
      name: args.name,
      collectionName: this._defaultCollectionName,
      scopeName: this._defaultScopeName,
    };
    return IonicCouchbaseLite.collection_GetIndexes(colArgs);
  }

  async database_GetPath(args: DatabaseArgs): Promise<{ path: string }> {
    return IonicCouchbaseLite.database_GetPath(args);
  }

  async database_Open(args: DatabaseOpenArgs): Promise<void> {
    return IonicCouchbaseLite.database_Open(args);
  }

  async database_PerformMaintenance(
      args: DatabasePerformMaintenanceArgs
  ): Promise<void> {
    return IonicCouchbaseLite.database_PerformMaintenance(args);
  }

  /**
   * @deprecated This will be removed in future versions. Use collection_GetCount instead.
   */
  async database_PurgeDocument(args: DatabasePurgeDocumentArgs): Promise<void> {
    const colArgs:CollectionPurgeDocumentArgs = {
      name: args.name,
      collectionName: this._defaultCollectionName,
      scopeName: this._defaultScopeName,
      docId: args.docId,
    };
    return IonicCouchbaseLite.collection_PurgeDocument(colArgs);
  }

  /**
   * @deprecated This function will be removed in future versions. Use colllection_Save instead.
   */
  async database_Save(
      args: DatabaseSaveArgs
  ): Promise<CollectionDocumentSaveResult> {
    const colArgs:CollectionSaveArgs = {
      name: args.name,
      collectionName: this._defaultCollectionName,
      scopeName: this._defaultScopeName,
      id: args.id,
      document: args.document,
      concurrencyControl: args.concurrencyControl,
    };
    return IonicCouchbaseLite.collection_Save(colArgs);
  }

  async database_SetFileLoggingConfig(
      args: DatabaseSetFileLoggingConfigArgs
  ): Promise<void> {
    return IonicCouchbaseLite.database_SetFileLoggingConfig(args);
  }

  async database_SetLogLevel(args: DatabaseSetLogLevelArgs): Promise<void> {
    return IonicCouchbaseLite.database_SetLogLevel(args);
  }

  /**
   * @deprecated This will be removed in future versions. Use collection_GetCount instead.
   */
  async document_GetBlobContent(
      args: DocumentGetBlobContentArgs
  ): Promise<{data: ArrayBuffer}> {
    const colArgs:CollectionDocumentGetBlobContentArgs = {
      name: args.name,
      collectionName: this._defaultCollectionName,
      scopeName: this._defaultScopeName,
      documentId: args.documentId,
      key: args.key
    };
    const data = await IonicCouchbaseLite.collection_GetBlobContent(colArgs);
    return {data: new Uint8Array(data.data).buffer};
  }

  async file_GetDefaultPath(): Promise<{ path: string }> {
    return IonicCouchbaseLite.file_GetDefaultPath();
  }

  async file_GetFileNamesInDirectory(args: {
    path: string;
  }): Promise<{ files: string[] }> {
    return IonicCouchbaseLite.file_GetFileNamesInDirectory(args);
  }

  async plugin_Configure(config: any): Promise<void> {
    return IonicCouchbaseLite.plugin_Configure({
      config,
    });
  }

  query_AddChangeListener(
      args: QueryChangeListenerArgs,
      cb: ListenerCallback
  ): Promise<ListenerHandle> {
    return IonicCouchbaseLite.query_AddChangeListener(
        {
          name: args.name,
          query: args.query,
          parameters: args.parameters,
          changeListenerToken: args.changeListenerToken,
        },
        cb
    );
  }

  async query_Execute(args: QueryExecuteArgs): Promise<Result> {
    return await IonicCouchbaseLite.query_Execute(args);
  }

  async query_Explain(args: QueryExecuteArgs): Promise<Result> {
    return await IonicCouchbaseLite.query_Explain(args);
  }

  async query_RemoveChangeListener(
      args: QueryRemoveChangeListenerArgs
  ): Promise<void> {
    return IonicCouchbaseLite.query_RemoveChangeListener(args);
  }

  replicator_AddChangeListener(
      args: ReplicationChangeListenerArgs,
      cb: ListenerCallback
  ): Promise<ListenerHandle> {
    return IonicCouchbaseLite.replicator_AddChangeListener(args, cb);
  }

  replicator_AddDocumentChangeListener(
      args: ReplicationChangeListenerArgs,
      cb: ListenerCallback
  ): Promise<ListenerHandle> {
    return IonicCouchbaseLite.replicator_AddDocumentChangeListener(args, cb);
  }

  async replicator_Cleanup(args: ReplicatorArgs): Promise<void> {
    return IonicCouchbaseLite.replicator_Cleanup(args);
  }

  async replicator_Create(
    args: ReplicatorCreateArgs
  ): Promise<ReplicatorArgs> {
    return await IonicCouchbaseLite.replicator_Create(args);
  }

  async replicator_GetStatus(args: ReplicatorArgs): Promise<ReplicatorStatus> {
    return IonicCouchbaseLite.replicator_GetStatus(args);
  }

  async replicator_GetPendingDocumentIds(args: ReplicatorCollectionArgs): Promise<{ pendingDocumentIds: string[] }>{
    return IonicCouchbaseLite.replicator_GetPendingDocumentIds(args);
  }

  async replicator_ResetCheckpoint(args: ReplicatorArgs): Promise<void> {
    return IonicCouchbaseLite.replicator_ResetCheckpoint(args);
  }

  async replicator_RemoveChangeListener(
      args: ReplicationChangeListenerArgs
  ): Promise<void> {
    return IonicCouchbaseLite.replicator_RemoveChangeListener(args);
  }

  async replicator_Start(args: ReplicatorArgs): Promise<void> {
    return IonicCouchbaseLite.replicator_Start(args);
  }

  async replicator_Stop(args: ReplicatorArgs): Promise<void> {
    return IonicCouchbaseLite.replicator_Stop(args);
  }

  async scope_GetDefault(args: DatabaseArgs): Promise<Scope> {
    return IonicCouchbaseLite.scope_GetDefault(args);
  }

  async scope_GetScope(args: ScopeArgs): Promise<Scope> {
    return IonicCouchbaseLite.scope_GetScope(args);
  }

  async scope_GetScopes(args: DatabaseArgs): Promise<ScopesResult> {
    return IonicCouchbaseLite.scope_GetScopes(args);
  }

}