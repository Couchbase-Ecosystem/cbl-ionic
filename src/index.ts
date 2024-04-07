import { registerPlugin } from '@capacitor/core';

import type { CblIonicPluginPlugin } from './definitions';

const CblIonicPlugin = registerPlugin<CblIonicPluginPlugin>('CblIonicPlugin', {
  web: () => import('./web').then(m => new m.CblIonicPluginWeb()),
});

export * from './definitions';
export { CblIonicPlugin };
