package cbl.js.kotiln
import android.content.Context
import com.couchbase.lite.*

import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import java.io.File
typealias CBLCollection = com.couchbase.lite.Collection


object DatabaseManager {
    //Private for management state of state
    private val openDatabases: MutableMap<String, Database> = mutableMapOf()

    //change listeners
    private val databaseChangeListener = mutableMapOf<String, ListenerToken>()

    private val defaultCollectionName: String = "_default"
    private val defaultScopeName: String = "_default"

    private fun getDatabase(databaseName: String): Database? {
        synchronized(openDatabases){
            if (openDatabases.containsKey(databaseName)) {
                return openDatabases[databaseName]!!
            }
            return null
        }
    }

    private fun buildDatabaseConfiguration(config: JSONObject?, context: Context)
    : DatabaseConfiguration {
        val databaseConfig = DatabaseConfiguration()
        config?.let { jsonConfig ->
            if (jsonConfig.has("directory")) {
                databaseConfig.directory = jsonConfig.getString("directory")
            }  else {
                val defaultDirectory = context.filesDir.canonicalPath
                databaseConfig.directory = defaultDirectory
            }
            if (jsonConfig.has("encryptionKey")) {
                databaseConfig.setEncryptionKey(EncryptionKey(jsonConfig.getString("encryptionKey")))
            }
        }
        return databaseConfig
    }

    fun openDatabase(databaseName: String, config: JSONObject?, context: Context): Database {
        synchronized(openDatabases) {
            val databaseConfig = buildDatabaseConfiguration(config, context)
            val newDatabase = Database(databaseName, databaseConfig)
            if (openDatabases.containsKey(databaseName)) {
                openDatabases.remove(databaseName)
            }
            openDatabases[databaseName] = newDatabase
            return newDatabase
        }
    }

    fun closeDatabase(databaseName: String) {
        synchronized(openDatabases) {
            val database = getDatabase(databaseName)
            database?.close()
        }
    }

    fun exists(databaseName: String, directoryPath:String): Boolean {
        val directory = File(directoryPath)
        return Database.exists(databaseName, directory)
    }

    fun delete(databaseName: String) {
        synchronized(openDatabases) {
            val db = getDatabase(databaseName)
            db?.let { database ->
                database.delete()
                openDatabases.remove(databaseName)
            }
        }
    }

    fun getPath(databaseName: String) : String {
        val db = getDatabase(databaseName)
        return db?.path ?: ""
    }

    fun copy(path: String, newName: String, databaseConfig: JSONObject?, context: Context) {
        val config = buildDatabaseConfiguration(databaseConfig, context)
        val filePath = File(path)
        Database.copy(filePath, newName, config)
    }

    fun performMaintenance(databaseName: String, maintenanceType: MaintenanceType) {
        val db = getDatabase(databaseName)
        db?.performMaintenance(maintenanceType)
    }

    fun defaultScope(databaseName: String): Scope? {
        val db = getDatabase(databaseName)
        return db?.defaultScope
    }

    fun scopes (databaseName: String): Set<Scope> {
        val db = getDatabase(databaseName)
        return db?.scopes ?: setOf()
    }

    fun scope(databaseName: String, scopeName: String): Scope? {
        val db = getDatabase(databaseName)
        return db?.getScope(scopeName)
    }

    fun createCollection(collectionName: String,
                         scopeName: String,
                         databaseName: String) : CBLCollection? {
        val db = getDatabase(databaseName)
        return db?.createCollection(collectionName, scopeName)
    }

    fun defaultCollection(databaseName: String) : CBLCollection? {
        val db = getDatabase(databaseName)
        return db?.defaultCollection
    }

    fun getCollection(collectionName: String,
                         scopeName: String,
                         databaseName: String) : CBLCollection? {
        val db = getDatabase(databaseName)
        return db?.getCollection(collectionName, scopeName)
    }


}