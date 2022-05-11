import Web3 from 'web3';
import { Web3ModuleAsyncOptions, Web3ModuleOptions } from './web3.interface';
import { Provider } from '@nestjs/common';
import { WEB3_CLIENT, WEB3_MODULE_OPTIONS } from './web3.constants';
import { randomUUID } from 'crypto';

export class Web3ClientError extends Error {}
export interface Web3Client {
  key: string;
  clients: Map<string, Web3>;
}

export const getClient = async (options: Web3ModuleOptions): Promise<Web3> => {
  const { url } = options;
  return new Web3(url);
};

export const createClient = (): Provider => ({
  provide: WEB3_CLIENT,
  useFactory: async (
    options: Web3ModuleOptions | Web3ModuleOptions[],
  ): Promise<Web3Client> => {
    const clients = new Map<string, Web3>();
    const defaultKey = randomUUID();

    if (Array.isArray(options)) {
      await Promise.all(
        options.map(async (opt) => {
          const key = opt.name || defaultKey;
          if (clients.has(key)) {
            throw new Web3ClientError(`web3 client ${key} already exists`);
          }

          clients.set(key, await getClient(opt));
        }),
      );
    } else {
      const key = options.name || defaultKey;
      clients.set(key, await getClient(options));
    }

    return {
      key: defaultKey,
      clients,
    };
  },
  inject: [WEB3_MODULE_OPTIONS],
});

export const createAsyncClientOptions = (options: Web3ModuleAsyncOptions) => ({
  provide: WEB3_MODULE_OPTIONS,
  useFactory: options.useFactory,
  inject: options.inject,
});
