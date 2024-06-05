package cbl.js.kotiln

import com.couchbase.lite.*
import java.util.EnumSet

object LoggingManager {
    fun setLogLevel(logDomain: String, logLevel: Int) {
        when (logDomain) {
            "ALL" -> Database.log.console.domains = LogDomain.ALL_DOMAINS
            "DATABASE" -> Database.log.console.domains = EnumSet.of(LogDomain.DATABASE)
            "NETWORK" -> Database.log.console.domains = EnumSet.of(LogDomain.NETWORK)
            "QUERY" -> Database.log.console.domains = EnumSet.of(LogDomain.QUERY)
            "REPLICATOR" -> Database.log.console.domains = EnumSet.of(LogDomain.REPLICATOR)
        }
        when (logLevel) {
            0 -> Database.log.console.level = LogLevel.DEBUG
            1 -> Database.log.console.level = LogLevel.VERBOSE
            2 -> Database.log.console.level = LogLevel.INFO
            3 -> Database.log.console.level = LogLevel.WARNING
            4 -> Database.log.console.level = LogLevel.ERROR
            5 -> Database.log.console.level = LogLevel.NONE
        }

    }
}