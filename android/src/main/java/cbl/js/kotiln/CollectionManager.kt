package cbl.js.kotiln

import com.couchbase.lite.ConcurrencyControl
import com.couchbase.lite.Document
import com.couchbase.lite.Index
import com.couchbase.lite.MutableDocument
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

object CollectionManager {
    private val defaultCollectionName: String = "_default"
    private val defaultScopeName: String = "_default"

    private fun getCollection(
        collectionName: String,
        scopeName: String,
        databaseName: String
    ): CBLCollection? {
        return DatabaseManager.getDatabase(databaseName)?.getCollection(collectionName, scopeName)
    }

    fun documentsCount(
        collectionName: String,
        scopeName: String,
        databaseName: String
    ): Int {
        var count = 0
        val col = this.getCollection(collectionName, scopeName, databaseName)
        col?.let { collection ->
            count = collection.count.toInt()
        }
        return count
    }

    @Throws(Error::class)
    fun saveDocument(
        documentId: String,
        document: Map<String, Any?>,
        concurrencyControl: ConcurrencyControl?,
        collectionName: String,
        scopeName: String,
        databaseName: String
    ): Pair<String, Boolean?> {
        val col = this.getCollection(collectionName, scopeName, databaseName)
        col?.let { collection ->
            concurrencyControl?.let {
                val mutableDocument = MutableDocument(documentId, document)
                val result = collection.save(mutableDocument, it)
                if (result) {
                    return Pair(mutableDocument.id, true)
                } else {
                    return Pair(mutableDocument.id, false)
                }
            }
            val mutableDocument = MutableDocument(documentId, document)
            collection.save(mutableDocument)
            return Pair(mutableDocument.id, null)
        }
        throw Error("Error: Document not saved")
    }

    fun getDocument(documentId: String,
                    collectionName: String,
                    scopeName: String,
                    databaseName: String): Document? {
        val col = this.getCollection(collectionName, scopeName, databaseName)
        col?.let { collection ->
            val doc = collection.getDocument(documentId)
            return doc
        }
        return null
    }

    fun getBlobContent(key: String,
                       documentId: String,
                       collectionName: String,
                        scopeName: String,
                        databaseName: String): ByteArray? {

        val doc = this.getDocument(documentId, collectionName, scopeName, databaseName)
        doc?.let { document ->
            val blob = document.getBlob(key)
            blob?.let { b ->
                return b.content
            }
        }
        return null
    }

    fun deleteDocument(documentId: String,
                       collectionName: String,
                       scopeName: String,
                       databaseName: String): Boolean {
        val col = this.getCollection(collectionName, scopeName, databaseName)
        col?.let { collection ->
            val doc = collection.getDocument(documentId)
            doc?.let { document ->
                collection.delete(document)
                return true
            }
        }
        return false
    }

    fun deleteDocument(documentId: String,
                       collectionName: String,
                       scopeName: String,
                       databaseName: String,
                       concurrencyControl: ConcurrencyControl): Boolean? {
        val col = this.getCollection(collectionName, scopeName, databaseName)
        col?.let { collection ->
            val doc = collection.getDocument(documentId)
            doc?.let { document ->
                val result = collection.delete(document, concurrencyControl)
                return result
            }
        }
        return null
    }

    fun purgeDocument(documentId: String,
                      collectionName: String,
                      scopeName: String,
                      databaseName: String) {
        val col = this.getCollection(collectionName, scopeName, databaseName)
        col?.purge(documentId)
    }

    fun setDocumentExpiration(documentId: String,
                              collectionName: String,
                              scopeName: String,
                              databaseName: String,
                              expiration: String) {
        val col = this.getCollection(collectionName, scopeName, databaseName)
        val format = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
        val expirationDate = format.parse(expiration)
        col?.setDocumentExpiration(documentId, expirationDate)
    }

    fun getDocumentExpiration(documentId: String,
                              collectionName: String,
                              scopeName: String,
                              databaseName: String): Date? {
        val col = this.getCollection(collectionName, scopeName, databaseName)
        return col?.getDocumentExpiration(documentId)
    }

    fun createIndex(indexName: String,
                    index: Index,
                    collectionName: String,
                    scopeName: String,
                    databaseName: String) {
        val col = this.getCollection(collectionName, scopeName, databaseName)
        col?.createIndex(indexName, index)
    }

    fun deleteIndex(indexName: String,
                    collectionName: String,
                    scopeName: String,
                    databaseName: String) {
        val col = this.getCollection(collectionName, scopeName, databaseName)
        col?.deleteIndex(indexName)
    }

    fun getIndexes(collectionName: String,
                   scopeName: String,
                   databaseName: String): Set<String>? {
        val col = this.getCollection(collectionName, scopeName, databaseName)
        return col?.getIndexes()
    }

}