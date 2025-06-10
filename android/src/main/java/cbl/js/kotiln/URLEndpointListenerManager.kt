package cbl.js.kotiln

import com.couchbase.lite.Collection
import com.couchbase.lite.ConnectionStatus
import com.couchbase.lite.URLEndpointListener
import com.couchbase.lite.URLEndpointListenerConfiguration
import com.couchbase.lite.TLSIdentity
import com.couchbase.lite.ListenerPasswordAuthenticator
import com.getcapacitor.JSObject
import java.util.UUID

class URLEndpointListenerManager private constructor() {
    private val listeners = mutableMapOf<String, URLEndpointListener>()

    companion object {
        val shared: URLEndpointListenerManager by lazy { URLEndpointListenerManager() }
    }

    fun createListener(
        collections: Set<Collection>,
        port: Int? = null,
        tlsIdentity: TLSIdentity? = null,
        networkInterface: String? = null,
        disableTLS: Boolean? = null,
        enableDeltaSync: Boolean? = null,
        authenticatorConfig: JSObject? = null,
    ): String {
        val config = URLEndpointListenerConfiguration(collections)
        port?.let { config.port = it }
        networkInterface?.let { config.networkInterface = it }
        disableTLS?.let { config.setDisableTls(it) }
        enableDeltaSync?.let { config.setEnableDeltaSync(it) }
        config.tlsIdentity = null

        // Convert authenticatorConfig (from JS) to a Kotlin Map<String, Any> recursively
        fun toKotlinMap(obj: Any?): Any? {
            return when (obj) {
                is org.json.JSONObject -> {
                    obj.keys().asSequence().associateWith { toKotlinMap(obj.get(it)) }
                }
                is org.json.JSONArray -> {
                    (0 until obj.length()).map { toKotlinMap(obj.get(it)) }
                }
                else -> obj
            }
        }

        if (authenticatorConfig != null) {
            val authenticatorConfigMap = toKotlinMap(authenticatorConfig) as Map<String, Any>
            val authenticator = listenerAuthenticatorFromConfig(authenticatorConfigMap)
            config.authenticator = authenticator
        }
        val listener = URLEndpointListener(config)
        val listenerId = UUID.randomUUID().toString()
        listeners[listenerId] = listener
        return listenerId
    }

    fun startListener(listenerId: String) {
        val listener = listeners[listenerId]
            ?: throw UnableToFindListenerException(listenerId)
        listener.start()
    }

    fun stopListener(listenerId: String) {
        val listener = listeners[listenerId]
            ?: throw UnableToFindListenerException(listenerId)
        listener.stop()
    }

    fun getListenerStatus(listenerId: String): ConnectionStatus? {
        val listener = listeners[listenerId]
            ?: throw UnableToFindListenerException(listenerId)
        return listener.status
    }

    fun getListenerUrls(listenerId: String): List<String> {
        val listener = listeners[listenerId]
            ?: throw UnableToFindListenerException(listenerId)
        return listener.urls.map { it.toString() } ?: emptyList()
    }

    private fun listenerAuthenticatorFromConfig(config: Map<String, Any>): ListenerPasswordAuthenticator? {
        val type = config["type"] as? String ?: return null
        val data = config["data"] as? Map<String, Any> ?: return null
        return when (type) {
            "basic" -> {
                val username = data["username"] as? String ?: return null
                val password = data["password"] as? String ?: return null
                ListenerPasswordAuthenticator { inputUsername, inputPassword ->
                    inputUsername == username && String(inputPassword) == password
                }
            }
            else -> null
        }
    }

    class UnableToFindListenerException(val listenerId: String) :
        Exception("Unable to find listener with id: $listenerId")
}