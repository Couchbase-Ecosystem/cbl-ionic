package com.couchbase.ionic

import cbl.js.kotiln.DatabaseManager
import com.couchbase.lite.Authenticator
import com.couchbase.lite.BasicAuthenticator
import com.couchbase.lite.CollectionConfiguration
import com.couchbase.lite.DocumentFlag
import com.couchbase.lite.DocumentReplication
import com.couchbase.lite.ReplicatorConfiguration
import com.couchbase.lite.ReplicatorConfigurationFactory
import com.couchbase.lite.ReplicatorStatus
import com.couchbase.lite.ReplicatorType
import com.couchbase.lite.SessionAuthenticator
import com.couchbase.lite.URLEndpoint
import com.couchbase.lite.newConfig
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import org.json.JSONArray
import org.json.JSONObject
import java.net.URI
import com.couchbase.lite.Collection as CBLCollection

object ReplicatorHelper {

    fun replicatorConfigFromJson(config: JSObject,
                                 collectionConfig: JSONArray
    )
    : ReplicatorConfiguration {
        val target = config.getJSObject("target")
        val url = target?.getString("url")
        val replicatorTypeString = config.getString("replicatorType")
        if (url.isNullOrEmpty() || replicatorTypeString.isNullOrEmpty()){
            throw IllegalArgumentException("Replicator target url or replicator type is required")
        }
        val uri = URI(url)
        val endpoint = URLEndpoint(uri)
        val continuous = config.getBoolean("continuous")
        val acceptParentDomainCookies = config.getBoolean("acceptParentDomainCookies")
        val acceptSelfSignedCerts = config.getBoolean("acceptSelfSignedCerts")
        val autoPurgeEnabled = config.getBoolean("autoPurgeEnabled")
        val replicatorType = getReplicatorTypeFromString(replicatorTypeString)

        val configBuilder = ReplicatorConfigurationFactory.newConfig(
            target = endpoint,
            continuous = continuous,
            acceptParentDomainCookies = acceptParentDomainCookies,
            acceptOnlySelfSignedServerCertificate = acceptSelfSignedCerts,
            enableAutoPurge = autoPurgeEnabled,
            type = replicatorType,
        )

        //optional values
        val authenticatorJson = config.optJSONObject("authenticator")
        authenticatorJson?.let {
            val auth = getAuthenticatorFromJson(it)
            configBuilder.setAuthenticator(auth)
        }

        //loop through the collections and configuration and add to the config
        //the item will have two keys, collections and config
        for (itemCounter in 0 until collectionConfig.length()) {
            val itemObject = collectionConfig.getJSONObject(itemCounter)
            val collections = itemObject.optJSONArray("collections")
            val mutableCollections = mutableListOf<CBLCollection>()
            if (collections == null || collections.length() == 0) {
                throw IllegalArgumentException("No collections found in the config")
            } else {
                    for(collectionCounter in 0 until collections.length()) {
                        val collectionItemObj = collections.getJSONObject(collectionCounter)
                        val collectionObj = collectionItemObj.getJSONObject("collection")
                        val collectionName = collectionObj.getString("name")
                        val scopeName = collectionObj.getString("scopeName")
                        val databaseName = collectionObj.getString("databaseName")
                        val collection = DatabaseManager.getCollection(collectionName, scopeName, databaseName)
                        if (collection == null) {
                            throw IllegalArgumentException("Collection not found")
                        } else {
                            mutableCollections.add(collection)
                        }
                    }
           }
            //get the configuration for the collections which is a collection
            //of documentIds and channels to filter
            //these should be optional, where at least one collection is needed to be added
            val replicatorCollectionConfig = CollectionConfiguration()
            val configObj = itemObject.optJSONObject("config")
            if (configObj != null){
                val documentIds = configObj.optJSONArray("documentIds")
                if (documentIds != null) {
                    val ids = mutableListOf<String>()
                    for (i in 0 until documentIds.length()) {
                        ids.add(documentIds.getString(i))
                    }
                    replicatorCollectionConfig.documentIDs = ids
                }
                val channels = configObj.optJSONArray("channels")
                if (channels != null) {
                    val channelsList = mutableListOf<String>()
                    for (i in 0 until channels.length()) {
                        channelsList.add(channels.getString(i))
                    }
                    replicatorCollectionConfig.channels = channelsList
                }
            }
            configBuilder.addCollections(mutableCollections, replicatorCollectionConfig)
       }
        return configBuilder
    }

    private fun getAuthenticatorFromJson(authenticator: JSONObject): Authenticator {
        val type = authenticator.getString("type")
        val data = authenticator.getJSONObject("data")
        return when (type) {
            "basic" -> {
                val username = data.getString("username")
                val password = data.getString("password")
                BasicAuthenticator(username, password.toCharArray())
            }
            "session" -> {
                val sessionId = data.getString("sessionId")
                val cookieName = data.getString("cookieName")
                SessionAuthenticator(sessionId, cookieName)
            }
            else -> throw IllegalArgumentException("Invalid authenticator type")
        }
    }

    private fun getReplicatorTypeFromString(strValue :String): ReplicatorType {
        return when (strValue) {
            "PUSH" -> ReplicatorType.PUSH
            "PULL" -> ReplicatorType.PULL
            "PUSH_AND_PULL" -> ReplicatorType.PUSH_AND_PULL
            else -> throw IllegalArgumentException("Invalid replicator type")
        }
    }

    fun generateReplicatorStatusJson(status: ReplicatorStatus): JSObject {
        val json = JSObject()
        val progressJson = JSObject()
        val errorJson = JSObject()
        status.error?.let {
            errorJson.put("message", it.message)
        }
        progressJson.put("completed", status.progress.completed)
        progressJson.put("total", status.progress.total)
        json.put("activity", status.activityLevel.name)
        json.put("progress", progressJson)
        json.put("error", errorJson)
        return json
    }

    fun generateReplicatorDocumentChangeJson(change: DocumentReplication) : JSObject {
        val json = JSObject()
        val docs = JSArray()
        for (doc in change.documents) {
            val docJson = JSObject()
            val flags = JSArray()
            if (doc.flags.contains(DocumentFlag.DELETED)) {
                flags.put("DELETED")
            } else if (doc.flags.contains(DocumentFlag.ACCESS_REMOVED)) {
                flags.put("ACCESS_REMOVED")
            }
            docJson.put("flags", flags)
            docJson.put("id", doc.id)
            docJson.put("scopeName", doc.scope)
            docJson.put("collectionName", doc.collection)
            docJson.put("error", doc.error?.message)
            docs.put(docJson)
        }
        json.put("documents", docs)
        json.put("isPush", change.isPush)
        return json
    }
}