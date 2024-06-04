@file:OptIn(DelicateCoroutinesApi::class)

package com.couchbase.ionic

import cbl.js.kotiln.CollectionDao
import cbl.js.kotiln.DatabaseManager
import cbl.js.kotiln.FileSystemHelper
import cbl.js.kotiln.ScopeDao
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

import org.json.JSONException

@CapacitorPlugin(name = "CblIonicPlugin")
@Suppress("FunctionName")
class CblIonicPluginPlugin : Plugin() {

    override fun load() {
        CouchbaseLite.init(bridge.context)
    }

    /**
     * getStringFromCall - used to get a string value from a call JSON object
     * passed in from Ionic
     *
     * @param call PluginCall object from Ionic
     * @param varName string value of the value to get out of the call object
     * @return Pair<String?, Boolean> A pair of the string value and
     * a boolean indicating if there is an error or not - if true then
     * error, if false, no error
     */
    private fun getStringFromCall(call: PluginCall, varName: String): Pair<String?, Boolean> {
        val value: String? = call.getString(varName)
        if (value.isNullOrEmpty()) {
            call.reject("Error: No $varName provided in call")
            return Pair(null, true)
        }
        return Pair(value, false)
    }

    private fun getCollectionDaoFromCall(call: PluginCall): CollectionDao? {
        var isError = false
        val (databaseName, isDatabaseNameError) = getStringFromCall(call, "name")
        val (collectionName, isCollectionNameError) = getStringFromCall(call, "collectionName")
        val (scopeName, isScopeNameError) = getStringFromCall(call, "scopeName")
        if (isDatabaseNameError || isCollectionNameError || isScopeNameError) {
            isError = true
        }
        collectionName?.let { colName ->
            scopeName?.let { scpName ->
                databaseName?.let { dbName ->
                    return CollectionDao(colName, scpName, dbName, isError)
                }
            }
        }
        return null
    }

    private fun getScopeDaoFromCall(call: PluginCall): ScopeDao? {
        var isError = false
        val (databaseName, isDatabaseNameError) = getStringFromCall(call, "name")
        val (scopeName, isScopeNameError) = getStringFromCall(call, "scopeName")
        if (isDatabaseNameError || isScopeNameError) {
            isError = true
        }
        scopeName?.let { scpName ->
            databaseName?.let { dbName ->
                return ScopeDao(scpName, dbName, isError)
            }
        }
        return null
    }

    /**
     * getIntFromCall - used to get a int value from a call JSON object
     * passed in from Ionic
     *
     * @param call PluginCall object from Ionic
     * @param varName int value of the value to get out of the call object
     * @return Pair<Int?, Boolean> A pair of the int value and
     * a boolean indicating if there is an error or not - if true then
     * error, if false, no error
     */
    private fun getIntFromCall(call: PluginCall, varName: String): Pair<Int?, Boolean> {
        val value: Int? = call.getInt(varName)
        if (value !== null) {
            call.reject("Error: No $varName provided in call")
            return Pair(value, true)
        }
        return Pair(value, false)
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    @Throws(JSONException::class, CouchbaseLiteException::class)
    fun Plugin_Configure(call: PluginCall) {
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
        val (name, isError) = getStringFromCall(call, "name")
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
        val (name, isNameError) = getStringFromCall(call, "existsName")
        val (path, isPathError) = getStringFromCall(call, "directory")
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
        val (name, isError) = getStringFromCall(call, "name")
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
        val (name, isError) = getStringFromCall(call, "name")
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
        val (name, isError) = getStringFromCall(call, "name")
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
        val (newName, isNewNameError) = getStringFromCall(call, "newName")
        val (path, isPathError) = getStringFromCall(call, "path")
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
                val (name, isNameError) = getStringFromCall(call, "name")
                val (maintenanceTypeInt, isMaintenanceTypeError) = getIntFromCall(
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

                } catch (e: Exception) {
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("${e.message}")
                    }
                }
            }
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    fun scope_GetDefault(call: PluginCall) {
        val (name, isNameError) = getStringFromCall(call, "name")
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
        val (name, isNameError) = getStringFromCall(call, "name")
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
        val scopeDao = getScopeDaoFromCall(call)
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
        val collectionDao = getCollectionDaoFromCall(call)
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
        val (name, isNameError) = getStringFromCall(call, "name")
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
        val scopeDao = getScopeDaoFromCall(call)
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
                    }
                } catch (e: Exception) {
                    return@withContext withContext(Dispatchers.Main) {
                        call.reject("${e.message}")
                    }
                }
            }
        }

        @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
        fun collection_GetCollection(call: PluginCall) {
            val collectionDao = getCollectionDaoFromCall(call)
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
        fun collection_DeleteCollections(call: PluginCall) {

        }

        @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
        @Throws(JSONException::class)
        fun collection_CreateIndex(call: PluginCall) {

        }

        @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
        @Throws(JSONException::class)
        fun collection_DeleteIndex(call: PluginCall) {

        }

        @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
        @Throws(JSONException::class)
        fun collection_GetIndexes(call: PluginCall) {

        }

        @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
        @Throws(JSONException::class)
        fun collection_Save(call: PluginCall) {

        }

        @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
        @Throws(JSONException::class)
        fun collection_GetCount(call: PluginCall) {

        }

        @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
        @Throws(JSONException::class)
        fun collection_DeleteDocument(call: PluginCall) {

        }

        @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
        @Throws(JSONException::class)
        fun collection_PurgeDocument(call: PluginCall) {

        }

        @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
        @Throws(JSONException::class)
        fun collection_GetDocument(call: PluginCall) {

        }

        @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
        @Throws(JSONException::class)
        fun collection_GetBlobContent(call: PluginCall) {

        }

        @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
        @Throws(JSONException::class)
        fun collection_SetDocumentExpiration(call: PluginCall) {

        }

        @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
        @Throws(JSONException::class)
        fun collection_GetDocumentExpiration(call: PluginCall) {

        }

        @PluginMethod(returnType = PluginMethod.RETURN_CALLBACK)
        @Throws(JSONException::class)
        fun collection_AddChangeListener(call: PluginCall) {

        }

        @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
        @Throws(JSONException::class)
        fun collection_RemoveChangeListener(call: PluginCall) {

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
        fun database_SetLogLevel(call: PluginCall) {

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
