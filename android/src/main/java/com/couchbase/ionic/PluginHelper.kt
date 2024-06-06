package com.couchbase.ionic

import cbl.js.kotiln.CollectionDto
import cbl.js.kotiln.ScopeDto
import com.couchbase.lite.Blob
import com.couchbase.lite.ConcurrencyControl
import com.couchbase.lite.Document
import com.couchbase.lite.FullTextIndexItem
import com.couchbase.lite.MutableArray
import com.couchbase.lite.MutableDictionary
import com.couchbase.lite.ValueIndexItem
import com.getcapacitor.JSObject
import com.getcapacitor.PluginCall
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject

object PluginHelper {
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
    fun getStringFromCall(call: PluginCall, varName: String): Pair<String?, Boolean> {
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
    fun getIntFromCall(call: PluginCall, varName: String): Pair<Int?, Boolean> {
        val value: Int? = call.getInt(varName)
        if (value == null) {
            call.reject("Error: No $varName provided in call")
            return Pair(null, true)
        }
        return Pair(value, false)
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
        val (indexType, isIndexTypeError) = getStringFromCall(call, "type")
        val indexData = call.getObject("index")
        val items = indexData?.getJSONArray("items")
        if (isIndexNameError || isIndexTypeError || indexData == null || items == null) {
            call.reject("Error: No couldn't parse indexName, type, or index, or items")
            return IndexDto(
                null,
                null,
                null,
                null,
                true)
        } else {
            return IndexDto(
                indexName,
                indexType,
                indexData,
                items,
                false)
        }
    }

    fun getConcurrencyControlFromInt(concurrencyControlValue: Int)
            : ConcurrencyControl {
        return when (concurrencyControlValue) {
            0 -> ConcurrencyControl.LAST_WRITE_WINS
            1 -> ConcurrencyControl.FAIL_ON_CONFLICT
            else -> ConcurrencyControl.LAST_WRITE_WINS
        }
    }

    @Throws(JSONException::class)
    fun toMap(jsonObject: JSONObject): Map<String, Any?> {
        val items: MutableMap<String, Any?> = HashMap()
        val keys = jsonObject.keys()
        while (keys.hasNext()) {
            val key = keys.next()
            val value = jsonObject[key]
            if (value is JSONObject) {
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

    fun documentToMap(document: Document): JSObject? {
        try {
            val docJson = JSONObject(document.toMap())
            val keys: Iterator<*> = docJson.keys()
            while (keys.hasNext()) {
                val key = keys.next() as String
                val value = docJson[key]
                if (value is Blob) {
                    val blobProps = JSONObject(value.getProperties())
                    docJson.put(key, blobProps)
                } else {
                    docJson.put(key, value)
                }
            }
            val docMap = JSObject()
            docMap.put("_data", docJson)
            docMap.put("_id", document.id)
            docMap.put("_sequence", document.sequence)
            return docMap
        } catch (ex: Exception) {
            return null
        }
    }

    @Throws(JSONException::class)
    fun makeValueIndexItems(items: JSONArray): Array<ValueIndexItem> {
        return Array(items.length()) { i ->
            val propName = items
                .getJSONArray(i)
                .getString(0)
                .substring(1)
            ValueIndexItem.property(propName)
        }
    }

    @Throws(JSONException::class)
    fun makeFullTextIndexItems(items: JSONArray): Array<FullTextIndexItem> {
        return Array(items.length()) { i ->
            val propName = items
                .getJSONArray(i)
                .getString(0)
                .substring(1)
            FullTextIndexItem.property(propName)
        }
    }
}