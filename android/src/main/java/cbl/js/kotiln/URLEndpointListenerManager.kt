package cbl.js.kotiln

import com.couchbase.lite.Collection
import com.couchbase.lite.ConnectionStatus
import com.couchbase.lite.URLEndpointListener
import com.couchbase.lite.URLEndpointListenerConfiguration
import com.couchbase.lite.TLSIdentity
import com.couchbase.lite.ListenerPasswordAuthenticator
import com.getcapacitor.JSObject
import java.util.UUID
import java.text.SimpleDateFormat
import java.util.TimeZone
import java.util.Base64

class URLEndpointListenerManager private constructor() {
    private val listeners = mutableMapOf<String, URLEndpointListener>()

    companion object {
        val shared: URLEndpointListenerManager by lazy { URLEndpointListenerManager() }
        @JvmStatic
        fun deleteIdentity(label: String) {
            throw UnsupportedOperationException("Delete identity is not implemented")
        }
    }

    fun createListener(
        collections: Set<Collection>,
        port: Int? = null,
        networkInterface: String? = null,
        disableTLS: Boolean? = null,
        enableDeltaSync: Boolean? = null,
        authenticatorConfig: JSObject? = null,
        tlsIdentityConfig: JSObject? = null
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
        if (tlsIdentityConfig != null) {
            val tlsIdentityConfigMap = toKotlinMap(tlsIdentityConfig) as Map<String, Any>

            val mode = tlsIdentityConfigMap["mode"] as? String ?: "selfSigned"
            val label = tlsIdentityConfigMap["label"] as? String ?: UUID.randomUUID().toString()
            if (mode == "selfSigned") {

            val attrs = (tlsIdentityConfigMap["attributes"] as? Map<*, *>)?.mapNotNull { 
                (k, v) -> 
                if (k is String && v is String) k to v else null 
            }?.toMap()?.toMutableMap() ?: mutableMapOf()

            // Map certAttrCommonName to the correct constant if present
            val commonName = attrs.remove("certAttrCommonName")
            if (commonName != null) {
                attrs[TLSIdentity.CERT_ATTRIBUTE_COMMON_NAME] = commonName
            }

            val expiration = tlsIdentityConfigMap["expiration"] as? String ?: null
            val expirationDate = expiration?.let { 
                val formatter = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSX")
                formatter.timeZone = TimeZone.getTimeZone("UTC")
                formatter.parse(it)
            }
            val tlsIdentity = TLSIdentity.createIdentity(true, attrs, expirationDate, label)
            config.tlsIdentity = tlsIdentity
            }
            if (mode == "imported") {
                throw UnsupportedOperationException("Importing TLS identity is not implemented")
            }
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
        //if listener is not started, urls is null
        if (listener.urls == null || listener.urls.isEmpty()) {
            return emptyList()
        }
        return listener.urls.map { it.toString() }
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