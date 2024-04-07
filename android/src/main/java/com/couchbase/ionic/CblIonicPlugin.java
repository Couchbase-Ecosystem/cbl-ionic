package com.couchbase.ionic;

import android.util.Log;

public class CblIonicPlugin {

    public String echo(String value) {
        Log.i("Echo", value);
        return value;
    }
}
