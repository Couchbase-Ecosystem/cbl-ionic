package com.couchbase.ionic

import cbl.js.kotiln.CollectionDto
import cbl.js.kotiln.DocumentDto
import cbl.js.kotiln.ScopeDto
import com.couchbase.lite.Blob
import com.couchbase.lite.ConcurrencyControl
import com.couchbase.lite.Document
import com.couchbase.lite.MutableArray
import com.couchbase.lite.MutableDictionary
import com.getcapacitor.JSObject
import com.getcapacitor.PluginCall
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject

object PluginHelper {

    fun getBlobsFromString(
        value: String):Map<String, Blob>
    {
        val items = mutableMapOf<String, Blob>()
        if (value.isEmpty() || value == "[]") {
            return items
        }
        val jsonObject = JSONObject(value)
        val keys = jsonObject.keys()
        while (keys.hasNext()) {
            val key = keys.next()
            val jsonValue = jsonObject[key]
            if (jsonValue is JSONObject) {
                val blobData = jsonValue.getJSONObject("data")
                val contentType = blobData.getString("contentType")
                val byteData = blobData.getJSONArray("data")
                val data = ByteArray(byteData.length())
                for (i in 0 until byteData.length()) {
                    data[i] = (byteData[i] as Int).toByte()
                }
                items[key] = Blob(contentType, data)
            }
        }
        return items
    }


    @Throws(JSONException::class)
    fun toMap(jsonObject: JSONObject): Map<String, Any?> {
        val items: MutableMap<String, Any?> = HashMap()
        val keys = jsonObject.keys()
        while (keys.hasNext()) {
            val key = keys.next()
            val value = jsonObject[key]
            if (value.equals(null)) {
                items[key] = null
            } else if (value is JSONObject && value.has("_data")) {
                val data = value.getJSONObject("_data")
                val doc = MutableDictionary(toMap(data))
                doc.setString("_id", value.getString("_id"))
                doc.setLong("_sequence", value.getLong("_sequence"))
                items[key] = doc
            } else if (value is JSONObject) {
                val type = value.optString("_type")
                // Handle blobs
                if (type == "blob") {
                    val blobData = value.getJSONObject("data")
                    val contentType = blobData.getString("contentType")
                    val byteData = blobData.getJSONArray("data")
                    val data = ByteArray(byteData.length())
                    for (i in 0 until byteData.length()) {
                        data[i] = (byteData[i] as Int).toByte()
                    }
                    items[key] = Blob(contentType, data)
                } else {
                    val d = MutableDictionary(toMap(value))
                    items[key] = d
                }
            } else if (value is JSONArray) {
                val mutArray = MutableArray()
                for (i in 0 until value.length()) {
                    when (val objValue = value[i]) {
                        null -> {
                            mutArray.addValue(null)
                        }

                        is JSONObject -> {
                            val dict = MutableDictionary(toMap(objValue))
                            mutArray.addDictionary(dict)
                        }

                        else -> {
                            mutArray.addValue(objValue)
                        }
                    }
                }
                items[key] = mutArray
            } else {
                items[key] = jsonObject[key]
            }
        }
        return items
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
    fun getStringFromCall(
        call: PluginCall,
        varName: String,
    ): Pair<String?, Boolean> {
        val value: String? = call.getString(varName)
        if (value.isNullOrEmpty()) {
            call.reject("Error: No $varName provided in call")
            return Pair(null, true)
        }
        return Pair(value, false)
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
    fun getIntFromCall(
        call: PluginCall,
        varName: String,
    ): Pair<Int?, Boolean> {
        val value: Int? = call.getInt(varName)
        if (value == null) {
            call.reject("Error: No $varName provided in call")
            return Pair(null, true)
        }
        return Pair(value, false)
    }

    fun getDocumentDtoFromCall(call: PluginCall): DocumentDto? {
        var isError = false
        val (document, isDocumentError) = getStringFromCall(call, "document")
        val (blobs, isBlobsError) = getStringFromCall(call, "blobs")
        if (isDocumentError || isBlobsError) {
            call.reject("Error: No couldn't parse document or blobs")
            isError = true
        }
        document?.let { docValue ->
            blobs?.let { blobsValue ->
                return DocumentDto(docValue, blobsValue, isError)
            }
        }
        return null
    }

    fun getCollectionDtoFromCall(call: PluginCall): CollectionDto? {
        var isError = false
        val (databaseName, isDatabaseNameError) = getStringFromCall(call, "name")
        val (collectionName, isCollectionNameError) = getStringFromCall(call, "collectionName")
        val (scopeName, isScopeNameError) = getStringFromCall(call, "scopeName")
        if (isDatabaseNameError || isCollectionNameError || isScopeNameError) {
            call.reject("Error: No couldn't parse collectionName, scopeName, or name (database name)")
            isError = true
        }
        collectionName?.let { colName ->
            scopeName?.let { scpName ->
                databaseName?.let { dbName ->
                    return CollectionDto(colName, scpName, dbName, isError)
                }
            }
        }
        return null
    }

    fun getScopeDtoFromCall(call: PluginCall): ScopeDto? {
        var isError = false
        val (databaseName, isDatabaseNameError) = getStringFromCall(call, "name")
        val (scopeName, isScopeNameError) = getStringFromCall(call, "scopeName")
        if (isDatabaseNameError || isScopeNameError) {
            call.reject("Error: No couldn't parse scopeName or name (database name)")

            isError = true
        }
        scopeName?.let { scpName ->
            databaseName?.let { dbName ->
                return ScopeDto(scpName, dbName, isError)
            }
        }
        return null
    }

    fun getIndexDtoFromCall(call: PluginCall): IndexDto? {
        val (indexName, isIndexNameError) = getStringFromCall(call, "indexName")
        val indexData = call.getObject("index")
        val items = indexData?.getJSONArray("items")
        val indexType = indexData?.getString("type")
        if (isIndexNameError || indexData == null || items == null || indexType.isNullOrEmpty()) {
            call.reject("Error: No couldn't parse indexName, type, or index, or items")
            return IndexDto(
                null,
                null,
                null,
                null,
                true,
            )
        } else {
            return IndexDto(
                indexName,
                indexType,
                indexData,
                items,
                false,
            )
        }
    }

    fun getConcurrencyControlFromInt(concurrencyControlValue: Int): ConcurrencyControl =
        when (concurrencyControlValue) {
            0 -> ConcurrencyControl.LAST_WRITE_WINS
            1 -> ConcurrencyControl.FAIL_ON_CONFLICT
            else -> ConcurrencyControl.LAST_WRITE_WINS
        }


    fun documentToMap(document: Document): JSObject? {
        try {
            val dMap = document.toMap()
            val docJson = JSONObject(dMap)
            val keys: Iterator<*> = docJson.keys()
            while (keys.hasNext()) {
                val key = keys.next() as String
                val value = dMap[key]
                // only replace the value if it's a blob because
                // JSONObject will not map in the blob object into the JSON object
                // since it's not a supported JSON type
                if (value is Blob) {
                    val blobProps = JSONObject(value.getProperties())
                    docJson.put(key, blobProps)
                }
            }
            val docMap = JSObject()
            docMap.put("_data", docJson)
            docMap.put("_id", document.id)
            docMap.put("_sequence", document.sequence)
            docMap.put("_revId", document.getRevisionID())
            return docMap
        } catch (ex: Exception) {
            throw ex
        }
    }
}
