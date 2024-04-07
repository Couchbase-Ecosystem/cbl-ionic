import { WebPlugin } from '@capacitor/core';

import type { CblIonicPluginPlugin } from './definitions';

export class CblIonicPluginWeb
  extends WebPlugin
  implements CblIonicPluginPlugin
{
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
