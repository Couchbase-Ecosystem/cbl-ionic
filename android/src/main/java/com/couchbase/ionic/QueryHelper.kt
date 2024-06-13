package com.couchbase.ionic

import com.couchbase.lite.Parameters
import com.getcapacitor.JSObject
import java.text.SimpleDateFormat

object QueryHelper {
    fun getQueryParameters(jsObject: JSObject): Parameters {
        val queryParameters = Parameters()
        for(key in jsObject.keys()){
            val nestedObject = jsObject.getJSObject(key)
            nestedObject?.let {
                val type = it.getString("type")
                val valueKey = "value"
                when(type){
                    "string" -> {
                        val strValue = it.getString(valueKey)
                        queryParameters.setString(key, strValue)
                    }
                    "float" -> {
                        val floatValue = it.getDouble(valueKey).toFloat()
                        queryParameters.setFloat(key, floatValue)
                    }
                    "boolean" -> {
                        val boolValue = it.getBoolean(valueKey)
                        queryParameters.setBoolean(key, boolValue)
                    }
                    "double" -> {
                        val doubleValue = it.getDouble(valueKey)
                        queryParameters.setDouble(key, doubleValue)
                    }
                    "date" -> {
                        val dateValue = it.getString(valueKey)
                        dateValue?.let { strValue ->
                            //
                            //bug in SDK with Android and Date
                            val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
                            val date = dateFormat.parse(strValue)
                            date?.let {d ->
                                queryParameters.setDate(key, d)
                            }
                        }
                    }
                    "int" -> {
                        val intValue = it.getInt(valueKey)
                        queryParameters.setInt(key, intValue)
                    }
                    "long" -> {
                        val longValue = it.getLong(valueKey)
                        queryParameters.setLong(key, longValue)
                    }
                    "value" -> {
                        val value = it.get(valueKey)
                        queryParameters.setValue(key, value)
                    }
                    else -> throw Exception("Invalid type sent")
                }
            }
        }
        return queryParameters
    }
}