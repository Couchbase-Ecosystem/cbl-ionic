#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(CblIonicPlugin, "CblIonicPlugin",
           //ionic capacitor functions
           CAP_PLUGIN_METHOD(plugin_Configure, CAPPluginReturnPromise);
           
           //file system helper functions
           CAP_PLUGIN_METHOD(file_GetDefaultPath, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(file_GetFileNamesInDirectory, CAPPluginReturnPromise);
           
           //database functions
           CAP_PLUGIN_METHOD(database_Open, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(database_Exists, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(database_Close, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(database_Delete, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(database_GetPath, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(database_Copy, CAPPluginReturnPromise);
           
           CAP_PLUGIN_METHOD(database_AddChangeListener, CAPPluginReturnCallback);
           CAP_PLUGIN_METHOD(database_RemoveChangeListener, CAPPluginReturnPromise);
           
           //maintainance functions
           CAP_PLUGIN_METHOD(database_PerformMaintenance, CAPPluginReturnPromise);
           
           //scope functions
           CAP_PLUGIN_METHOD(scope_GetDefault, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(scope_GetScopes, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(scope_GetScope, CAPPluginReturnPromise);
           
           //collection functions
           CAP_PLUGIN_METHOD(collection_GetDefault, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(collection_GetCollections, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(collection_CreateCollection, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(collection_GetCollection, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(collection_DeleteCollection, CAPPluginReturnPromise);
           
           //index functions
           CAP_PLUGIN_METHOD(collection_CreateIndex, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(collection_DeleteIndex, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(collection_GetIndexes, CAPPluginReturnPromise);
           
           //document functions
           CAP_PLUGIN_METHOD(collection_Save, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(collection_GetCount, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(collection_DeleteDocument, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(collection_PurgeDocument, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(collection_GetDocument, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(collection_GetBlobContent, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(collection_SetDocumentExpiration, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(collection_GetDocumentExpiration, CAPPluginReturnPromise);

           //collection change listeners
           CAP_PLUGIN_METHOD(collection_AddChangeListener, CAPPluginReturnCallback);
           CAP_PLUGIN_METHOD(collection_RemoveChangeListener, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(collection_AddDocumentChangeListener, CAPPluginReturnCallback);
           CAP_PLUGIN_METHOD(collection_RemoveDocumentChangeListener, CAPPluginReturnPromise);

           //logging functions
           CAP_PLUGIN_METHOD(database_SetLogLevel, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(database_GetLogLevel, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(database_GetLogDomain, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(database_SetFileLoggingConfig, CAPPluginReturnPromise);
           
           //query functions
           CAP_PLUGIN_METHOD(query_Execute, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(query_Explain, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(query_AddChangeListener, CAPPluginReturnCallback);
           CAP_PLUGIN_METHOD(query_RemoveChangeListener, CAPPluginReturnPromise);

           //replicator functions
           CAP_PLUGIN_METHOD(replicator_Create, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(replicator_Start, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(replicator_Stop, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(replicator_ResetCheckpoint, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(replicator_GetStatus, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(replicator_GetPendingDocumentIds, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(replicator_AddChangeListener, CAPPluginReturnCallback);
           CAP_PLUGIN_METHOD(replicator_RemoveChangeListener, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(replicator_AddDocumentChangeListener, CAPPluginReturnCallback);
           CAP_PLUGIN_METHOD(replicator_Cleanup, CAPPluginReturnPromise);
)
