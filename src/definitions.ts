export interface CblIonicPluginPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
