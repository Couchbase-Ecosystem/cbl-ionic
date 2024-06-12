package com.couchbase.ionic

import com.couchbase.lite.FullTextIndexItem
import com.couchbase.lite.ValueIndexItem
import org.json.JSONArray
import org.json.JSONException

object IndexHelper {
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