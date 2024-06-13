package cbl.js.kotiln

import android.content.Context

object FileSystemHelper {

    fun fileGetDefaultPath(context: Context): String {
        return context.filesDir.canonicalPath
    }

}