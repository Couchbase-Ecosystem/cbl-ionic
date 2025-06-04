package cbl.js.kotiln

import com.couchbase.lite.Collection
import com.couchbase.lite.ConnectionStatus
import com.couchbase.lite.URLEndpointListener
import com.couchbase.lite.URLEndpointListenerConfiguration
import com.couchbase.lite.TLSIdentity
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
        enableDeltaSync: Boolean? = null
    ): String {
        val config = URLEndpointListenerConfiguration(collections)
        port?.let { config.port = it }
        networkInterface?.let { config.networkInterface = it }
        disableTLS?.let { config.setDisableTls(it) }
        enableDeltaSync?.let { config.setEnableDeltaSync(it) }
        config.tlsIdentity = null

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

    class UnableToFindListenerException(val listenerId: String) :
        Exception("Unable to find listener with id: $listenerId")
}