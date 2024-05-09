/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  DocumentResult,
  EngineLocator,
  Scope,
  Collection,
  DatabaseArgs,
  ScopeArgs,
  CollectionArgs,
  DatabaseOpenArgs,
  DatabaseCopyArgs,
  DatabaseExistsArgs,
  DatabasePerformMaintenanceArgs,
  DatabaseSetLogLevelArgs,
  DatabaseSetFileLoggingConfigArgs,
  CollectionCreateIndexArgs,
  CollectionDeleteIndexArgs,
  DatabaseCreateIndexArgs,
  DatabaseDeleteIndexArgs,
  DatabaseSaveArgs,
  CollectionSaveArgs,
  CollectionDocumentSaveResult,
  DatabasePurgeDocumentArgs,
  CollectionPurgeDocumentArgs,
  DatabaseDeleteDocumentArgs,
  CollectionDeleteDocumentArgs,
  DatabaseGetDocumentArgs,
  CollectionGetDocumentArgs,
  DocumentGetBlobContentArgs,
  CollectionDocumentGetBlobContentArgs,
  QueryExecuteArgs,
  DatabaseChangeListenerArgs,
  Result,
  ReplicatorCreateArgs,
  ReplicatorArgs,
  ReplicatorStatus,
  CollectionsResult, ScopesResult,
} from "cblite";

import { IonicCouchbaseLite } from "../ionic-couchbase-lite";

import { PluginCallback, PluginListenerHandle } from "@capacitor/core";

import { IonicCouchbaseLitePlugin } from "../definitions";

export interface EngineReplicatorStartResult {
  replicatorId: string;
}

export class CapacitorEngine implements IonicCouchbaseLitePlugin {
  _defaultCollectionName = "_default";
  _defaultScopeName = "_default";

  constructor(config: any = {}) {
    this.plugin_Configure(config);
    EngineLocator.registerEngine(EngineLocator.key, this);
  }

  async plugin_Configure(config: any): Promise<void> {
    return IonicCouchbaseLite.plugin_Configure({
      config,
    });
  }

  async file_GetDefaultPath(): Promise<{ path: string }> {
    return IonicCouchbaseLite.file_GetDefaultPath();
  }

  async file_GetFileNamesInDirectory(args: {
    path: string;
  }): Promise<{ files: string[] }> {
    return IonicCouchbaseLite.file_GetFileNamesInDirectory(args);
  }

  // ****************************
  // Database top level functions
  // ****************************

  async database_Open(args: DatabaseOpenArgs): Promise<void> {
    return IonicCouchbaseLite.database_Open(args);
  }

  async database_GetPath(args: DatabaseArgs): Promise<{ path: string }> {
    return IonicCouchbaseLite.database_GetPath(args);
  }

  async database_Copy(args: DatabaseCopyArgs): Promise<void> {
    return IonicCouchbaseLite.database_Copy(args);
  }

  async database_Exists(
    args: DatabaseExistsArgs
  ): Promise<{ exists: boolean }> {
    return IonicCouchbaseLite.database_Exists(args);
  }

  async database_Close(args: DatabaseArgs): Promise<void> {
    return IonicCouchbaseLite.database_Close(args);
  }

  async database_Delete(args: DatabaseArgs): Promise<void> {
    return IonicCouchbaseLite.database_Delete(args);
  }

  //*********************
  // Database maintenance
  //*********************

  async database_PerformMaintenance(
    args: DatabasePerformMaintenanceArgs
  ): Promise<void> {
    return IonicCouchbaseLite.database_PerformMaintenance(args);
  }

  //*****************
  // Database logging
  //*****************

  async database_SetLogLevel(args: DatabaseSetLogLevelArgs): Promise<void> {
    return IonicCouchbaseLite.database_SetLogLevel(args);
  }

  async database_SetFileLoggingConfig(
    args: DatabaseSetFileLoggingConfigArgs
  ): Promise<void> {
    return IonicCouchbaseLite.database_SetFileLoggingConfig(args);
  }

  //*******
  // Scopes
  //*******

  async scope_GetDefault(args: DatabaseArgs): Promise<Scope> {
    return IonicCouchbaseLite.scope_GetDefault(args);
  }

  async scope_GetScopes(args: DatabaseArgs): Promise<ScopesResult> {
    return IonicCouchbaseLite.scope_GetScopes(args);
  }

  async scope_GetScope(args: ScopeArgs): Promise<Scope> {
    return IonicCouchbaseLite.scope_GetScope(args);
  }

  //************
  // Collections
  //************

  async collection_GetDefault(args: DatabaseArgs): Promise<Collection> {
    return IonicCouchbaseLite.collection_GetDefault(args);
  }

  async collection_GetCollections(args: ScopeArgs): Promise<CollectionsResult> {
    return IonicCouchbaseLite.collection_GetCollections(args);
  }

  async collection_GetCollection(args: CollectionArgs): Promise<Collection> {
    return IonicCouchbaseLite.collection_GetCollection(args);
  }

  async collection_CreateCollection(args: CollectionArgs): Promise<Collection> {
    return IonicCouchbaseLite.collection_CreateCollection(args);
  }

  async collection_DeleteCollection(args: CollectionArgs): Promise<void> {
    return IonicCouchbaseLite.collection_DeleteCollection(args);
  }

  //*********
  // Indexing
  //*********

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

  async collection_CreateIndex(args: CollectionCreateIndexArgs): Promise<void> {
    return IonicCouchbaseLite.collection_CreateIndex(args);
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

  async collection_DeleteIndex(args: CollectionDeleteIndexArgs): Promise<void> {
    return IonicCouchbaseLite.collection_DeleteIndex(args);
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

  async collection_GetIndexes(
    args: CollectionArgs
  ): Promise<{ indexes: string[] }> {
    return IonicCouchbaseLite.collection_GetIndexes(args);
  }

  //**********************************
  // Documents
  //**********************************
  /**
   
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

  async collection_Save(
    args: CollectionSaveArgs
  ): Promise<CollectionDocumentSaveResult> {
    return IonicCouchbaseLite.collection_Save(args);
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

  async collection_GetCount(args: CollectionArgs): Promise<{ count: number }> {
    return IonicCouchbaseLite.collection_GetCount(args);
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

  async collection_PurgeDocument(args: CollectionPurgeDocumentArgs): Promise<void> {
    return IonicCouchbaseLite.collection_PurgeDocument(args);
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

  async collection_DeleteDocument(args: CollectionDeleteDocumentArgs): Promise<void> {
    return IonicCouchbaseLite.collection_DeleteDocument(args);
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

  async collection_GetDocument(args: CollectionGetDocumentArgs)
    : Promise<DocumentResult> {
    return IonicCouchbaseLite.collection_GetDocument(args);
  }

  /**
   * @deprecated This will be removed in future versions. Use collection_GetCount instead.
   */ 
  async document_GetBlobContent(
    args: DocumentGetBlobContentArgs
  ): Promise<ArrayBuffer> {
    const colArgs:CollectionDocumentGetBlobContentArgs = {
      name: args.name,
      collectionName: this._defaultCollectionName,
      scopeName: this._defaultScopeName,
      documentId: args.documentId,
      key: args.key
    };
    const data = await IonicCouchbaseLite.collection_GetDocumentBlobContent(colArgs);
    return new Uint8Array(data).buffer;
  }

  async collection_GetDocumentBlobContent(
    args: CollectionDocumentGetBlobContentArgs
  ) : Promise<ArrayBuffer> {
    const data = await IonicCouchbaseLite.collection_GetDocumentBlobContent(args);
    return new Uint8Array(data).buffer;
  }

  //**********************
  // Query 
  //**********************
  async query_Execute(args: QueryExecuteArgs): Promise<Result> {
    return await IonicCouchbaseLite.query_Execute(args);
  }

  async query_Explain(args: QueryExecuteArgs): Promise<Result> {
    return await IonicCouchbaseLite.query_Explain(args);
  }

  async replicator_Create(
    args: ReplicatorCreateArgs
  ): Promise<EngineReplicatorStartResult> {
    return IonicCouchbaseLite.replicator_Create(args);
  }

  async replicator_Start(args: ReplicatorArgs): Promise<void> {
    return IonicCouchbaseLite.replicator_Start(args);
  }

  async replicator_Restart(args: ReplicatorArgs): Promise<void> {
    return IonicCouchbaseLite.replicator_Restart(args);
  }

  async replicator_Stop(args: ReplicatorArgs): Promise<void> {
    return IonicCouchbaseLite.replicator_Stop(args);
  }

  async replicator_ResetCheckpoint(args: ReplicatorArgs): Promise<void> {
    return IonicCouchbaseLite.replicator_ResetCheckpoint(args);
  }

  async replicator_GetStatus(args: ReplicatorArgs): Promise<ReplicatorStatus> {
    return IonicCouchbaseLite.replicator_GetStatus(args);
  }

  async replicator_Cleanup(args: ReplicatorArgs): Promise<void> {
    return IonicCouchbaseLite.replicator_Cleanup(args);
  }

  //************************* 
  // TODO fix change listeners
  //************************* 

  /**
   * @deprecated This will be removed in future versions. Use collection_RemoveChangeListener instead.
   */ 
  async database_RemoveChangeListener(
    args: DatabaseChangeListenerArgs
  ): Promise<void> {
    return IonicCouchbaseLite.database_RemoveChangeListener(args);
  }

  /**
   * @deprecated This will be removed in future versions. Use collection_AddChangeListener instead.
   */ 
  database_AddChangeListener(
    args: DatabaseChangeListenerArgs,
    cb: PluginCallback
  ): Promise<PluginListenerHandle> {
    return IonicCouchbaseLite.database_AddChangeListener(
      {
        name: args.name,
        changeListenerToken: args.changeListenerToken,
      },
      cb
    );
  }

  replicator_AddChangeListener(
    args: ReplicatorArgs,
    cb: PluginCallback
  ): Promise<PluginListenerHandle> {
    return IonicCouchbaseLite.replicator_AddChangeListener(args, cb);
  }

  replicator_AddDocumentListener(
    args: ReplicatorArgs,
    cb: PluginCallback
  ): Promise<PluginListenerHandle> {
    return IonicCouchbaseLite.replicator_AddDocumentListener(args, cb);
  }
}
