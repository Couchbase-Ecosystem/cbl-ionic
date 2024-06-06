@file:OptIn(DelicateCoroutinesApi::class)

package com.couchbase.ionic

import cbl.js.kotiln.CollectionManager
import cbl.js.kotiln.DatabaseManager
import cbl.js.kotiln.FileSystemHelper
import cbl.js.kotiln.LoggingManager
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.couchbase.lite.*
import com.getcapacitor.JSArray
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.json.JSONArray

import org.json.JSONException

@CapacitorPlugin(name = "CblIonicPlugin")
@Suppress("FunctionName")
class CblIonicPluginPlugin : Plugin() {

    private val collectionChangeListeners: MutableMap<String, ListenerToken> = mutableMapOf()
    private val collectionDocumentChangeListeners: MutableMap<String, ListenerToken> =
        mutableMapOf()
    private val queryChangeListeners: MutableMap<String, ListenerToken> = mutableMapOf()
    private val replicationChangeListeners: MutableMap<String, ListenerToken> = mutableMapOf()

    override fun load() {
        CouchbaseLite.init(bridge.context)
    }


    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class, CouchbaseLiteException::class)
    fun plugin_Configure(call: PluginCall) {
        val config: JSObject = call.getObject("config")
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun file_GetDefaultPath(call: PluginCall) {
        val defaultPath = FileSystemHelper.fileGetDefaultPath(bridge.context)
        val results = JSObject()
        results.put("path", defaultPath)
        call.resolve(results)
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun file_GetFileNamesInDirectory(call: PluginCall) {

    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    fun database_Open(call: PluginCall) {
        val (name, isError) = PluginHelper.getStringFromCall(call, "name")
        if (isError) {
            return
        }
        val config = call.getObject("config")
        if (config == null) {
            call.reject("No database configuration provided")
            return
        }
        GlobalScope.launch {
            name?.let { databaseName ->
                withContext(Dispatchers.IO) {
                    try {
                        DatabaseManager.openDatabase(databaseName, config, bridge.context)
                        return@withContext withContext(Dispatchers.Main) {
                            call.resolve()
                        }
                    } catch (e: Exception) {
                        return@withContext withContext(Dispatchers.Main) {
                            call.reject("${e.message}")
                        }
                    }
                }
            }
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun database_Exists(call: PluginCall) {
        val (name, isNameError) = PluginHelper.getStringFromCall(call, "existsName")
        val (path, isPathError) = PluginHelper.getStringFromCall(call, "directory")
        if (isNameError || isPathError) {
            return
        }
        try {
            name?.let { databaseName ->
                path?.let { directory ->
                    val exists = DatabaseManager.exists(databaseName, directory)
                    val results = JSObject()
                    results.put("exists", exists)
                    call.resolve(results)
                    return
                }
            }
            call.reject("Error: Unknown error checking for database existence")
            return
        } catch (e: Exception) {
            call.reject("${e.message}")
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    fun database_Close(call: PluginCall) {
        val (name, isError) = PluginHelper.getStringFromCall(call, "name")
        if (isError) {
            return
        }
        GlobalScope.launch {
            name?.let { databaseName ->
                withContext(Dispatchers.IO) {
                    try {
                        DatabaseManager.closeDatabase(databaseName)
                        return@withContext withContext(Dispatchers.Main) {
                            call.resolve()
                        }
                    } catch (e: Exception) {
                        return@withContext withContext(Dispatchers.Main) {
                            call.reject("${e.message}")
                        }
                    }
                }
            }
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    fun database_Delete(call: PluginCall) {
        val (name, isError) = PluginHelper.getStringFromCall(call, "name")
        if (isError) {
            return
        }
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                name?.let { databaseName ->
                    try {
                        DatabaseManager.delete(databaseName)
                        return@withContext withContext(Dispatchers.Main) {
                            call.resolve()
                        }
                    } catch (e: Exception) {
                        return@withContext withContext(Dispatchers.Main) {
                            call.reject("${e.message}")
                        }
                    }
                }
            }
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    fun database_GetPath(call: PluginCall) {
        val (name, isError) = PluginHelper.getStringFromCall(call, "name")
        if (isError) {
            return
        }
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                name?.let { databaseName ->
                    try {
                        val path = DatabaseManager.getPath(databaseName)
                        withContext(Dispatchers.Main) {
                            if (path.isEmpty()) {
                                call.reject("Error: Path is empty")
                            } else {
                                val results = JSObject()
                                results.put("path", path)
                                call.resolve(results)
                            }
                        }
                    } catch (e: Exception) {
                        return@withContext withContext(Dispatchers.Main) {
                            call.reject("${e.message}")
                        }
                    }
                }
            }
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    fun database_Copy(call: PluginCall) {
        val (newName, isNewNameError) = PluginHelper.getStringFromCall(call, "newName")
        val (path, isPathError) = PluginHelper.getStringFromCall(call, "path")
        if (isNewNameError || isPathError) {
            return
        }
        val config = call.getObject("config")
            ?: return call.reject("No database configuration provided")
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                try {
                    path?.let { filePath ->
                        newName?.let { newDatabaseName ->
                            DatabaseManager.copy(filePath, newDatabaseName, config, bridge.context)
                            return@withContext withContext(Dispatchers.Main) {
                                call.resolve()
                            }
                        }
                    }
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("Error: no file path returned for copy")
                    }
                } catch (e: Exception) {
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("${e.message}")
                    }
                }
            }
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    fun database_PerformMaintenance(call: PluginCall) {
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                val (name, isNameError) = PluginHelper.getStringFromCall(call, "name")
                val (maintenanceTypeInt, isMaintenanceTypeError) = PluginHelper.getIntFromCall(
                    call,
                    "maintenanceType"
                )
                if (isNameError || isMaintenanceTypeError) {
                    return@withContext
                }
                try {
                    name?.let { databaseName ->
                        val maintenanceType = when (maintenanceTypeInt) {
                            0 -> MaintenanceType.COMPACT
                            1 -> MaintenanceType.REINDEX
                            2 -> MaintenanceType.INTEGRITY_CHECK
                            3 -> MaintenanceType.OPTIMIZE
                            else -> MaintenanceType.FULL_OPTIMIZE
                        }
                        DatabaseManager.performMaintenance(databaseName, maintenanceType)
                        return@withContext withContext(Dispatchers.Main) {
                            call.resolve()
                        }
                    }
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("Error: No database name provided")
                    }

                } catch (e: Exception) {
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("${e.message}")
                    }
                }
            }
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun database_SetLogLevel(call: PluginCall) {
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                val (domain, isDomainError) = PluginHelper.getStringFromCall(call, "domain")
                val (levelInt, isLevelError) = PluginHelper.getIntFromCall(
                    call,
                    "logLevel"
                )
                if (isDomainError || isLevelError) {
                    return@withContext
                }
                try {
                    domain?.let { logDomain ->
                        levelInt?.let { logLevel ->
                            LoggingManager.setLogLevel(logDomain, logLevel)
                            return@withContext withContext(Dispatchers.Main) {
                                call.resolve()
                            }
                        }
                    }
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("Error: No domain or log level provided")
                    }
                } catch (e: Exception) {
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("${e.message}")
                    }
                }
            }
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun database_GetLogLevel(call: PluginCall) {

    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun database_GetLogDomain(call: PluginCall) {

    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    fun scope_GetDefault(call: PluginCall) {
        val (name, isNameError) = PluginHelper.getStringFromCall(call, "name")
        if (isNameError) {
            return
        }
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                try {
                    name?.let { databaseName ->
                        val scope = DatabaseManager.defaultScope(databaseName)
                        scope?.let {
                            val results = JSObject()
                            results.put("name", scope.name)
                            results.put("databaseName", name)
                            return@withContext withContext(Dispatchers.Main) {
                                call.resolve(results)
                            }
                        }
                    }
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("Error: No database name or default scope found")
                    }
                } catch (e: Exception) {
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("${e.message}")
                    }
                }
            }
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun scope_GetScopes(call: PluginCall) {
        val (name, isNameError) = PluginHelper.getStringFromCall(call, "name")
        if (isNameError) {
            return
        }
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                try {
                    name?.let { databaseName ->
                        val scopes = DatabaseManager.scopes(databaseName)
                        val results = JSObject()
                        val scopeArray = JSArray()
                        for (scope in scopes) {
                            val scopeObject = JSObject()
                            scopeObject.put("name", scope.name)
                            scopeObject.put("databaseName", name)
                            scopeArray.put(scopeObject)
                        }
                        results.put("scopes", scopeArray)
                        return@withContext withContext(Dispatchers.Main) {
                            call.resolve(results)
                        }
                    }
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("Error: No database name provided or scope found")
                    }
                } catch (e: Exception) {
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("${e.message}")
                    }
                }
            }
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun scope_GetScope(call: PluginCall) {
        val scopeDao = PluginHelper.getScopeDtoFromCall(call)
        if (scopeDao == null || scopeDao.isError) {
            return
        }
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                try {
                    val scope = DatabaseManager.getScope(scopeDao.databaseName, scopeDao.scopeName)
                    scope?.let {
                        val results = JSObject()
                        results.put("name", scope.name)
                        results.put("databaseName", scopeDao.databaseName)
                        return@withContext withContext(Dispatchers.Main) {
                            call.resolve(results)
                        }
                    }
                    return@withContext withContext(Dispatchers.Main) {
                        call.resolve()
                    }
                } catch (e: Exception) {
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("${e.message}")
                    }
                }
            }
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun collection_CreateCollection(call: PluginCall) {
        val collectionDao = PluginHelper.getCollectionDtoFromCall(call)
        if (collectionDao == null || collectionDao.isError) {
            return
        }
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                try {
                    val collection = DatabaseManager.createCollection(
                        collectionDao.collectionName,
                        collectionDao.scopeName,
                        collectionDao.databaseName
                    )
                    collection?.let { col ->
                        val colResult = JSObject()
                        val scopeResult = JSObject()
                        colResult.put("name", col.name)
                        scopeResult.put("name", col.scope.name)
                        scopeResult.put("databaseName", collectionDao.databaseName)
                        colResult.put("scope", scopeResult)
                        return@withContext withContext(Dispatchers.Main) {
                            call.resolve(colResult)
                        }
                    }
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("Error: Collection not created")
                    }
                } catch (e: Exception) {
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("${e.message}")
                    }
                }
            }
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun collection_GetDefault(call: PluginCall) {
        val (name, isNameError) = PluginHelper.getStringFromCall(call, "name")
        if (isNameError) {
            return
        }
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                try {
                    name?.let { databaseName ->
                        val collection = DatabaseManager.defaultCollection(databaseName)
                        collection?.let {
                            val result = JSObject()
                            val scopeResult = JSObject()
                            result.put("name", collection.name)
                            scopeResult.put("name", collection.scope.name)
                            scopeResult.put("databaseName", name)
                            result.put("scope", scopeResult)
                            return@withContext withContext(Dispatchers.Main) {
                                call.resolve(result)
                            }
                        }
                        return@withContext withContext(Dispatchers.Main) {
                            //should never get to this code hopefully
                            call.reject("Error: No default collection found")
                        }
                    }
                } catch (e: Exception) {
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("${e.message}")
                    }
                }
            }
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    fun collection_GetCollections(call: PluginCall) {
        val scopeDao = PluginHelper.getScopeDtoFromCall(call)
        if (scopeDao == null || scopeDao.isError) {
            return
        }
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                try {
                    val results = JSObject()
                    val collectionArray = JSArray()
                    val collections =
                        DatabaseManager.getCollections(scopeDao.scopeName, scopeDao.databaseName)
                    collections?.let { cols ->
                        for (collection in cols) {
                            val collectionObject = JSObject()
                            collectionObject.put("name", collection.name)
                            val scopeObject = JSObject()
                            scopeObject.put("name", collection.scope.name)
                            scopeObject.put("databaseName", scopeDao.databaseName)
                            collectionObject.put("scope", scopeObject)
                            collectionArray.put(collectionObject)
                            results.put("collections", collectionArray)
                        }
                    }
                    return@withContext withContext(Dispatchers.Main) {
                        results.put("collections", collectionArray)
                        call.resolve(results)
                    }
                } catch (e: Exception) {
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("${e.message}")
                    }
                }
            }
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    fun collection_GetCollection(call: PluginCall) {
        val collectionDao = PluginHelper.getCollectionDtoFromCall(call)
        if (collectionDao == null || collectionDao.isError) {
            return
        }
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                try {
                    val collection = DatabaseManager.getCollection(
                        collectionDao.collectionName,
                        collectionDao.scopeName,
                        collectionDao.databaseName
                    )
                    collection?.let { col ->
                        val colResult = JSObject()
                        val scopeResult = JSObject()
                        colResult.put("name", col.name)
                        scopeResult.put("name", col.scope.name)
                        scopeResult.put("databaseName", collectionDao.databaseName)
                        colResult.put("scope", scopeResult)
                        return@withContext withContext(Dispatchers.Main) {
                            call.resolve(colResult)
                        }
                    }
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("Error: couldn't resolve collection")
                    }
                } catch (e: Exception) {
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("${e.message}")
                    }
                }
            }
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun collection_DeleteCollection(call: PluginCall) {
        val collectionDao = PluginHelper.getCollectionDtoFromCall(call)
        if (collectionDao == null || collectionDao.isError) {
            return
        }
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                try {
                    DatabaseManager.deleteCollection(
                        collectionDao.collectionName,
                        collectionDao.scopeName,
                        collectionDao.databaseName
                    )
                    return@withContext withContext(Dispatchers.Main) {
                        call.resolve()
                    }
                } catch (e: Exception) {
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("${e.message}")
                    }
                }
            }
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    fun collection_Save(call: PluginCall) {
        var docConcurrencyControl: ConcurrencyControl? = null
        val collectionDao = PluginHelper.getCollectionDtoFromCall(call)
        if (collectionDao == null || collectionDao.isError) {
            return
        }
        val (documentId, isError) = PluginHelper.getStringFromCall(call, "id")
        val docId: String = if (isError || documentId.isNullOrEmpty()) {
            ""
        } else {
            documentId
        }
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                try {
                    val concurrencyControlValue = call.getInt("concurrencyControl")
                    concurrencyControlValue?.let {
                        docConcurrencyControl = PluginHelper.getConcurrencyControlFromInt(it)
                    }
                    val document = call.getObject("document")
                    document?.let {
                        val documentMap = PluginHelper.toMap(document)
                        val (resultDocId, concurrencyResult) = CollectionManager.saveDocument(
                            docId,
                            documentMap,
                            docConcurrencyControl,
                            collectionDao.collectionName,
                            collectionDao.scopeName,
                            collectionDao.databaseName
                        )
                        val results = JSObject()
                        results.put("_id", resultDocId)
                        results.put("concurrencyResult", concurrencyResult)
                        return@withContext withContext(Dispatchers.Main) {
                            call.resolve(results)
                        }
                    }
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("Error: couldn't map document from JSON Object to Map<String, Any?>")
                    }
                } catch (e: Exception) {
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("${e.message}")
                    }
                }
            }
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun collection_GetCount(call: PluginCall) {
        val collectionDao = PluginHelper.getCollectionDtoFromCall(call)
        if (collectionDao == null || collectionDao.isError) {
            return
        }
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                try {
                    val count = CollectionManager.documentsCount(
                        collectionDao.collectionName,
                        collectionDao.scopeName,
                        collectionDao.databaseName
                    )
                    val results = JSObject()
                    results.put("count", count)
                    return@withContext withContext(Dispatchers.Main) {
                        call.resolve(results)
                    }
                } catch (e: Exception) {
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("${e.message}")
                    }
                }
            }
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    fun collection_GetDocument(call: PluginCall) {
        val collectionDao = PluginHelper.getCollectionDtoFromCall(call)
        if (collectionDao == null || collectionDao.isError) {
            return
        }
        val (documentId, isError) = PluginHelper.getStringFromCall(call, "docId")
        if (isError || documentId.isNullOrEmpty()) {
            return
        }
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                try {
                    val document = CollectionManager.getDocument(
                        documentId,
                        collectionDao.collectionName,
                        collectionDao.scopeName,
                        collectionDao.databaseName
                    )
                    document?.let {
                        val results = PluginHelper.documentToMap(it)
                        return@withContext withContext(Dispatchers.Main) {
                            if (results == null) {
                                call.reject("Error mapping document data")
                            } else {
                                call.resolve(results)
                            }
                        }
                    }
                    return@withContext withContext(Dispatchers.Main) {
                        val results = JSObject()
                        call.resolve(results)
                    }
                } catch (e: Exception) {
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("${e.message}")
                    }
                }
            }
        }
    }

    /**
     * collection_DeleteDocument - used to delete a document from the collection
     *
     * requires the following key/value pairs in the PluginCall:
     *
     * docId - the document id
     *
     * concurrencyControl - value of the concurrency control enum
     *
     * name - name of the database
     *
     * collectionName - name of the collection
     *
     * scopeName - name of the scope
     *
     * @param call PluginCall object from Ionic
     * @return concurrency results if used if successful, error message if not
     */
    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun collection_DeleteDocument(call: PluginCall) {
        var docConcurrencyControl: ConcurrencyControl? = null
        val collectionDao = PluginHelper.getCollectionDtoFromCall(call)
        if (collectionDao == null || collectionDao.isError) {
            return
        }
        val (documentId, isError) = PluginHelper.getStringFromCall(call, "docId")
        if (isError || documentId.isNullOrEmpty()) {
            return
        }
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                try {
                    var result: Boolean? = null
                    val concurrencyControlValue = call.getInt("concurrencyControl")
                    if (concurrencyControlValue != null) {
                        docConcurrencyControl =
                            PluginHelper.getConcurrencyControlFromInt(concurrencyControlValue)
                        docConcurrencyControl?.let { conControl ->
                            result = CollectionManager.deleteDocument(
                                documentId,
                                collectionDao.collectionName,
                                collectionDao.scopeName,
                                collectionDao.databaseName,
                                conControl
                            )

                        }
                    } else {
                        result = CollectionManager.deleteDocument(
                            documentId,
                            collectionDao.collectionName,
                            collectionDao.scopeName,
                            collectionDao.databaseName
                        )
                    }
                    return@withContext withContext(Dispatchers.Main) {
                        val results = JSObject()
                        results.put("concurrencyControlResult", result)
                        call.resolve(results)
                    }

                } catch (e: Exception) {
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("${e.message}")
                    }
                }
            }
        }
    }

    /**
     * collection_PurgeDocument - used to purge a document from the collection
     *
     * requires the following key/value pairs in the PluginCall:
     *
     * docId - the document id
     *
     * name - name of the database
     *
     * collectionName - name of the collection
     *
     * scopeName - name of the scope
     *
     * @param call PluginCall object from Ionic
     * @return nothing if successful, error message if not
     */
    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun collection_PurgeDocument(call: PluginCall) {
        val collectionDao = PluginHelper.getCollectionDtoFromCall(call)
        if (collectionDao == null || collectionDao.isError) {
            return
        }
        val (documentId, isError) = PluginHelper.getStringFromCall(call, "docId")
        if (isError || documentId.isNullOrEmpty()) {
            return
        }
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                try {
                    CollectionManager.purgeDocument(
                        documentId,
                        collectionDao.collectionName,
                        collectionDao.scopeName,
                        collectionDao.databaseName
                    )
                    return@withContext withContext(Dispatchers.Main) {
                        call.resolve()
                    }
                } catch (e: Exception) {
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("${e.message}")
                    }
                }
            }
        }
    }

    /**
     * collection_GetBlobContent - used to get blob content in an document
     *
     * requires the following key/value pairs in the PluginCall:
     *
     * documentId - the document id
     *
     * key - the key that the blob is stored under in the document
     *
     * name - name of the database
     *
     * collectionName - name of the collection
     *
     * scopeName - name of the scope
     *
     * @param call PluginCall object from Ionic
     * @return nothing if successful, error message if not
     */
    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun collection_GetBlobContent(call: PluginCall) {
        val collectionDao = PluginHelper.getCollectionDtoFromCall(call)
        if (collectionDao == null || collectionDao.isError) {
            return
        }
        val (key, isKeyError) = PluginHelper.getStringFromCall(call, "key")
        if (isKeyError || key.isNullOrEmpty()) {
            return
        }
        val (documentId, isDocumentIdError) = PluginHelper.getStringFromCall(call, "documentId")
        if (isDocumentIdError || documentId.isNullOrEmpty()) {
            return
        }
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                try {
                    val blobData = CollectionManager.getBlobContent(
                        key,
                        documentId,
                        collectionDao.collectionName,
                        collectionDao.scopeName,
                        collectionDao.databaseName
                    )
                    return@withContext withContext(Dispatchers.Main) {
                        val results = JSObject()
                        if (blobData == null) {
                            results.put("data", emptyArray<Byte>())
                        } else {
                            results.put("data", blobData)
                        }
                        call.resolve(results)
                    }
                } catch (e: Exception) {
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("${e.message}")
                    }
                }
            }
        }
    }

    /**
     * collection_SetDocumentExpiration - used to set the document expiration
     * passed in from Ionic
     *
     * requires the following key/value pairs in the PluginCall:
     *
     * docId - the document id
     *
     * expiration - the expiration date to set on the document - must
     * be in a string in the format `yyyy-MM-dd HH:mm:ss`
     *
     * name - name of the database
     *
     * collectionName - name of the collection
     *
     * scopeName - name of the scope
     *
     * @param call PluginCall object from Ionic
     * @return nothing if successful, error message if not
     */
    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun collection_SetDocumentExpiration(call: PluginCall) {
        val collectionDao = PluginHelper.getCollectionDtoFromCall(call)
        if (collectionDao == null || collectionDao.isError) {
            return
        }
        val (expiration, isExpirationError) = PluginHelper.getStringFromCall(call, "expiration")
        if (isExpirationError || expiration.isNullOrEmpty()) {
            return
        }
        val (documentId, isDocumentIdError) = PluginHelper.getStringFromCall(call, "docId")
        if (isDocumentIdError || documentId.isNullOrEmpty()) {
            return
        }
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                try {
                    CollectionManager.setDocumentExpiration(
                        documentId,
                        expiration,
                        collectionDao.collectionName,
                        collectionDao.scopeName,
                        collectionDao.databaseName
                    )
                    return@withContext withContext(Dispatchers.Main) {
                        call.resolve()
                    }
                } catch (e: Exception) {
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("${e.message}")
                    }
                }
            }
        }
    }

    /**
     * collection_GetDocumentExpiration - used to get the document expiration
     * date
     *
     * requires the following key/value pairs in the PluginCall:
     *
     * docId - the document id to set the expiration on
     *
     * name - name of the database
     *
     * collectionName - name of the collection
     *
     * scopeName - name of the scope
     *
     * @param call PluginCall object from Ionic
     * @return date of expiration if successful, error message if not
     */
    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    fun collection_GetDocumentExpiration(call: PluginCall) {
        val collectionDao = PluginHelper.getCollectionDtoFromCall(call)
        if (collectionDao == null || collectionDao.isError) {
            return
        }
        val (documentId, isDocumentIdError) = PluginHelper.getStringFromCall(call, "docId")
        if (isDocumentIdError || documentId.isNullOrEmpty()) {
            return
        }
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                try {
                    val expiration = CollectionManager.getDocumentExpiration(
                        documentId,
                        collectionDao.collectionName,
                        collectionDao.scopeName,
                        collectionDao.databaseName
                    )
                    return@withContext withContext(Dispatchers.Main) {
                        val results = JSObject()
                        results.put("date", expiration)
                        call.resolve(results)
                    }
                } catch (e: Exception) {
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("${e.message}")
                    }
                }
            }
        }
    }

    /**
     * collection_CreateIndex - used to create an index in the collection
     * date
     *
     * requires the following key/value pairs in the PluginCall:
     *
     * indexName - string name of the index
     *
     * type - string name of the type, options must be: "value" or "full-text"
     *
     * index - dictionary of the index items
     *
     * name - name of the database
     *
     * collectionName - name of the collection
     *
     * scopeName - name of the scope
     *
     * @param call PluginCall object from Ionic
     * @return date of expiration if successful, error message if not
     */
    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    fun collection_CreateIndex(call: PluginCall) {
        val collectionDao = PluginHelper.getCollectionDtoFromCall(call)
        if (collectionDao == null || collectionDao.isError) {
            return
        }
        val indexDto = PluginHelper.getIndexDtoFromCall(call)
        if (indexDto == null || indexDto.isError) {
            return
        }
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                try {
                    indexDto.indexType?.let { type ->
                        indexDto.indexName?.let { name ->
                            indexDto.indexItems?.let { items ->
                                var index: Index? = null
                                if (type == "value") {
                                    val indexes = PluginHelper.makeValueIndexItems(items)
                                    index = IndexBuilder.valueIndex(*indexes)
                                } else if (type == "full-text") {
                                    val indexes = PluginHelper.makeFullTextIndexItems(items)
                                    index = IndexBuilder.fullTextIndex(*indexes)
                                }
                                index?.let { idx ->
                                    CollectionManager.createIndex(
                                        name,
                                        idx,
                                        collectionDao.collectionName,
                                        collectionDao.scopeName,
                                        collectionDao.databaseName
                                    )
                                    return@withContext withContext(Dispatchers.Main) {
                                        call.resolve()
                                    }
                                }
                            }
                        }
                    }
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("Error: No index type, name, data, or items provided - could not create index")
                    }

                } catch (e: Exception) {
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("${e.message}")
                    }
                }
            }
        }
    }

    /**
     * collection_DeleteIndex - used to delete an index in the collection
     * date
     *
     * requires the following key/value pairs in the PluginCall:
     *
     * indexName - string name of the index
     *
     * name - name of the database
     *
     * collectionName - name of the collection
     *
     * scopeName - name of the scope
     *
     * @param call PluginCall object from Ionic
     * @return date of expiration if successful, error message if not
     */
    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun collection_DeleteIndex(call: PluginCall) {
        val collectionDao = PluginHelper.getCollectionDtoFromCall(call)
        if (collectionDao == null || collectionDao.isError) {
            return
        }
        val (indexName, isIndexNameError) = PluginHelper.getStringFromCall(call, "indexName")
        if (isIndexNameError || indexName.isNullOrEmpty()) {
            return
        }
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                try {
                    CollectionManager.deleteIndex(
                        indexName,
                        collectionDao.collectionName,
                        collectionDao.scopeName,
                        collectionDao.databaseName
                    )
                    return@withContext withContext(Dispatchers.Main) {
                        call.resolve()
                    }
                } catch (e: Exception) {
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("${e.message}")
                    }
                }
            }
        }
    }

    /**
     * collection_GetIndexes - used to get an array (string) of indexes
     * in the collection
     *
     * requires the following key/value pairs in the PluginCall:
     *
     * name - name of the database
     *
     * collectionName - name of the collection
     *
     * scopeName - name of the scope
     *
     * @param call PluginCall object from Ionic
     * @return date of expiration if successful, error message if not
     */
    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun collection_GetIndexes(call: PluginCall) {
        val collectionDao = PluginHelper.getCollectionDtoFromCall(call)
        if (collectionDao == null || collectionDao.isError) {
            return
        }
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                try {
                    val indexes = CollectionManager.getIndexes(
                        collectionDao.collectionName,
                        collectionDao.scopeName,
                        collectionDao.databaseName
                    )
                    val results = JSObject()
                    val arrayResults = JSArray(indexes)
                    results.put("indexes", arrayResults)
                    call.resolve(results)
                } catch (e: Exception) {
                    call.reject("${e.message}")
                }
            }
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_CALLBACK)
    @Throws(JSONException::class)
    fun collection_AddChangeListener(call: PluginCall) {
        val collectionDao = PluginHelper.getCollectionDtoFromCall(call)
        if (collectionDao == null || collectionDao.isError) {
            return
        }
        val (strToken, isTokenError) = PluginHelper.getStringFromCall(call, "changeListenerToken")
        if (isTokenError || strToken.isNullOrEmpty()) {
            return
        }
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                try {
                    val col = DatabaseManager.getCollection(
                        collectionDao.collectionName,
                        collectionDao.scopeName,
                        collectionDao.databaseName
                    )
                    call.setKeepAlive(true)
                    withContext(Dispatchers.Main) {
                        col?.let { collection ->
                            val listenerToken = collection.addChangeListener { change ->
                                val results = JSObject()
                                results.put("documentIDs", JSONArray(change.documentIDs))
                                call.resolve(results)
                            }
                            collectionChangeListeners.put(strToken, listenerToken)
                        }
                    }
                } catch (e: Exception) {
                    call.reject("${e.message}")
                }
            }
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun collection_RemoveChangeListener(call: PluginCall) {
        val collectionDao = PluginHelper.getCollectionDtoFromCall(call)
        if (collectionDao == null || collectionDao.isError) {
            return
        }
        val (strToken, isTokenError) = PluginHelper.getStringFromCall(call, "changeListenerToken")
        if (isTokenError || strToken.isNullOrEmpty()) {
            return
        }
        GlobalScope.launch {
            withContext(Dispatchers.IO) {
                try {
                    val token = collectionChangeListeners[strToken]
                    token?.remove()
                    collectionChangeListeners.remove(strToken)
                    return@withContext withContext(Dispatchers.Main) {
                        call.resolve()
                    }
                } catch (e: Exception) {
                    call.reject("${e.message}")
                }
            }
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_CALLBACK)
    @Throws(JSONException::class)
    fun collection_AddDocumentChangeListener(call: PluginCall) {

    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun collection_RemoveDocumentChangeListener(call: PluginCall) {

    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun database_SetFileLoggingConfig(call: PluginCall) {

    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun query_Execute(call: PluginCall) {

    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun query_Explain(call: PluginCall) {

    }

    @PluginMethod(returnType = PluginMethod.RETURN_CALLBACK)
    @Throws(JSONException::class)
    fun query_AddChangeListener(call: PluginCall) {

    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun query_RemoveChangeListener(call: PluginCall) {

    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun replicator_Create(call: PluginCall) {

    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun replicator_Start(call: PluginCall) {

    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun replicator_Stop(call: PluginCall) {

    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun replicator_ResetCheckpoint(call: PluginCall) {

    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun replicator_GetStatus(call: PluginCall) {

    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun replicator_GetPendingDocumentIds(call: PluginCall) {

    }

    @PluginMethod(returnType = PluginMethod.RETURN_CALLBACK)
    @Throws(JSONException::class)
    fun replicator_AddChangeListener(call: PluginCall) {

    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun replicator_RemoveChangeListener(call: PluginCall) {

    }

    @PluginMethod(returnType = PluginMethod.RETURN_CALLBACK)
    @Throws(JSONException::class)
    fun replicator_AddDocumentChangeListenerr(call: PluginCall) {

    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class)
    fun replicator_Cleanup(call: PluginCall) {

    }
}
