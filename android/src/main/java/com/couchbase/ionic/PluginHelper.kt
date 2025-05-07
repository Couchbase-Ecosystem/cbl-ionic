package com.couchbase.ionic

import cbl.js.kotiln.CollectionDto
import cbl.js.kotiln.DocumentDto
import cbl.js.kotiln.ScopeDto
import com.couchbase.lite.Blob
import com.couchbase.lite.ConcurrencyControl
import com.couchbase.lite.Document
import com.getcapacitor.JSObject
import com.getcapacitor.PluginCall
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject

object PluginHelper {

    /**
     * Converts a `Document` object to a `JSObject` representation.
     *
     * This method transforms the given `Document` into a `JSObject` that includes its data, ID, sequence, and revision ID.
     * It iterates through the document's map, and if a value is a `Blob`, it replaces it with its properties in the resulting JSON object.
     *
     * @param document The `Document` object to convert.
     * @return A `JSObject` containing the document's data, ID, sequence, and revision ID, or `null` if an error occurs.
     * @throws Exception If an error occurs during the conversion process.
     */
    fun documentToMap(document: Document): JSObject {
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
                    val blobProps = JSONObject(value.properties)
                    blobProps.put("raw", JSONArray(value.content))
                    docJson.put(key, blobProps)
                }
            }
            val docMap = JSObject()
            docMap.put("_data", docJson)
            docMap.put("_id", document.id)
            docMap.put("_sequence", document.sequence)
            docMap.put("_revId", document.revisionID)
            return docMap
        } catch (ex: Exception) {
            throw ex
        }
    }

    /**
     * Converts a JSON string representation of blobs into a map of Blob objects.
     *
     * @param value The JSON string containing blob data. The string should be in the format:
     *              {
     *                  "blobKey1": {
     *                      "data": {
     *                          "contentType": "mime/type",
     *                          "data": [byte1, byte2, ...]
     *                      }
     *                  },
     *                  "blobKey2": {
     *                      "data": {
     *                          "contentType": "mime/type",
     *                          "data": [byte1, byte2, ...]
     *                      }
     *                  }
     *              }
     *              If the string is empty or "[]", an empty map is returned.
     * @return A map where the keys are the blob identifiers and the values are Blob objects.
     * @throws JSONException If the JSON string is malformed or if required fields are missing.
     */
    @Throws(JSONException::class)
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

    /**
     * Extracts and constructs a `CollectionDto` object from the given `PluginCall`.
     *
     * This method retrieves the `name` (database name), `collectionName`, and `scopeName` strings from the `PluginCall` object.
     * If any of these values are missing or empty, the method rejects the call and returns `null`.
     * Otherwise, it constructs and returns a `CollectionDto` object containing the extracted values.
     *
     * @param call The `PluginCall` object from which to extract the `name`, `collectionName`, and `scopeName` strings.
     * @return A `CollectionDto` object containing the extracted `name`, `collectionName`, and `scopeName` strings, or `null` if an error occurs.
     */
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

    /**
     * Converts an integer value to a `ConcurrencyControl` enum.
     *
     * This method maps the given integer value to a corresponding `ConcurrencyControl` enum value.
     * The mapping is as follows:
     * - 0: `ConcurrencyControl.LAST_WRITE_WINS`
     * - 1: `ConcurrencyControl.FAIL_ON_CONFLICT`
     * - Any other value: `ConcurrencyControl.LAST_WRITE_WINS`
     *
     * @param concurrencyControlValue The integer value to convert.
     * @return The corresponding `ConcurrencyControl` enum value.
     */
    fun getConcurrencyControlFromInt(concurrencyControlValue: Int): ConcurrencyControl =
        when (concurrencyControlValue) {
            0 -> ConcurrencyControl.LAST_WRITE_WINS
            1 -> ConcurrencyControl.FAIL_ON_CONFLICT
            else -> ConcurrencyControl.LAST_WRITE_WINS
        }

    /**
     * Extracts and constructs a `DocumentDto` object from the given `PluginCall`.
     *
     * This method retrieves the `document` and `blobs` strings from the `PluginCall` object.
     * If either of these values is missing or empty, the method rejects the call and returns `null`.
     * Otherwise, it constructs and returns a `DocumentDto` object containing the extracted values.
     *
     * @param call The `PluginCall` object from which to extract the `document` and `blobs` strings.
     * @return A `DocumentDto` object containing the extracted `document` and `blobs` strings, or `null` if an error occurs.
     */
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

    /**
     * Extracts and constructs an `IndexDto` object from the given `PluginCall`.
     *
     * This method retrieves the `indexName`, `type`, and `items` from the `index` object within the `PluginCall`.
     * If any of these values are missing or empty, the method rejects the call and returns an `IndexDto` object with `isError` set to `true`.
     * Otherwise, it constructs and returns an `IndexDto` object containing the extracted values.
     *
     * @param call The `PluginCall` object from which to extract the `indexName`, `type`, and `items`.
     * @return An `IndexDto` object containing the extracted `indexName`, `type`, and `items`, or an `IndexDto` object with `isError` set to `true` if an error occurs.
     */
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

    /**
     * Extracts and constructs a `ScopeDto` object from the given `PluginCall`.
     *
     * This method retrieves the `name` (database name) and `scopeName` strings from the `PluginCall` object.
     * If either of these values is missing or empty, the method rejects the call and returns `null`.
     * Otherwise, it constructs and returns a `ScopeDto` object containing the extracted values.
     *
     * @param call The `PluginCall` object from which to extract the `name` and `scopeName` strings.
     * @return A `ScopeDto` object containing the extracted `name` and `scopeName` strings, or `null` if an error occurs.
     */
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
     * Converts a `Collection` object to a `JSObject` representation.
     *
     * This method transforms the given `Collection` into a `JSObject` that includes its name, scope, and database name.
     * The resulting JSON object contains the following structure:
     * {
     *   "name": "collectionName",
     *   "scope": {
     *     "name": "scopeName",
     *     "databaseName": "databaseName"
     *   }
     * }
     *
     * @param collection The `Collection` object to convert.
     * @param databaseName The name of the database to which the collection belongs.
     * @return A `JSObject` containing the collection's name, scope, and database name.
     */
    fun collectionToJson(collection: CollectionDto): JSObject {
        val colResult = JSObject()
        val scopeResult = JSObject()
        colResult.put("name", collection.collectionName)
        scopeResult.put("name", collection.scopeName)
        scopeResult.put("databaseName", collection.databaseName)
        colResult.put("scope", scopeResult)
        return colResult
    }
}
