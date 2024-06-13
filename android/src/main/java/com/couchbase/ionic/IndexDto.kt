package com.couchbase.ionic

import org.json.JSONArray
import org.json.JSONObject

data class IndexDto (
    val indexName: String?,
    val indexType: String?,
    val indexData: JSONObject?,
    val indexItems: JSONArray?,
    val isError: Boolean
)
