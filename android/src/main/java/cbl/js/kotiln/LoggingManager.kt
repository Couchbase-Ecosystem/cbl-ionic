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
        val loggingValue = getLogLevel(logLevel)
        Database.log.console.level = loggingValue
    }

    fun getLogLevel(logLevelValue: Int): LogLevel {
        when (logLevelValue) {
            0 -> return LogLevel.DEBUG
            1 -> return LogLevel.VERBOSE
            2 -> return LogLevel.INFO
            3 -> return LogLevel.WARNING
            4 -> return LogLevel.ERROR
            5 -> return LogLevel.NONE
        }
        return LogLevel.DEBUG
    }
}