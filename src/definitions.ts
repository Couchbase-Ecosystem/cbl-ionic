/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */

import {
  ICoreEngine
} from 'cblite';

export interface PluginConfigureArgs {
  config: any;
}

/**
  * Represents Ionic Couchbase Lite Plugin engine 
  * 
  * @interface
  */
export interface IonicCouchbaseLitePlugin   
    extends ICoreEngine {
  //Plugin Configuration
  plugin_Configure(args: PluginConfigureArgs)
    : Promise<void>;
}
