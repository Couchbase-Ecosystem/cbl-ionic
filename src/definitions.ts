/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */

import {
  ICoreEngine,
  ReplicatorArgs
} from 'cblite';

import { PluginCallback, PluginListenerHandle } from '@capacitor/core';

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

  replicator_AddDocumentListener(
      args: ReplicatorArgs,
      cb: PluginCallback)
      : Promise<PluginListenerHandle>;

}
