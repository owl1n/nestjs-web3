import { ModuleMetadata } from '@nestjs/common';

export interface Web3ModuleOptions {
  name?: string;
  url: string;
}

export interface Web3ModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) =>
    | Web3ModuleOptions
    | Web3ModuleOptions[]
    | Promise<Web3ModuleOptions>
    | Promise<Web3ModuleOptions[]>;
  inject?: any[];
}
