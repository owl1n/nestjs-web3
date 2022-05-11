import {
  DynamicModule,
  Global,
  Inject,
  Module,
  OnModuleDestroy,
} from '@nestjs/common';
import { Web3ModuleAsyncOptions, Web3ModuleOptions } from './web3.interface';
import { WEB3_CLIENT, WEB3_MODULE_OPTIONS } from './web3.constants';
import {
  createAsyncClientOptions,
  createClient,
  Web3Client,
} from './web3-client.provider';
import { HttpProviderBase } from 'web3-core-helpers';
import { Web3Service } from './web3.service';

@Global()
@Module({
  providers: [Web3Service],
  exports: [Web3Service],
})
export class Web3CoreModule implements OnModuleDestroy {
  constructor(
    @Inject(WEB3_MODULE_OPTIONS)
    private readonly options: Web3ModuleOptions | Web3ModuleOptions[],
    @Inject(WEB3_CLIENT)
    private readonly web3Client: Web3Client,
  ) {}

  static register(
    options: Web3ModuleOptions | Web3ModuleOptions[],
  ): DynamicModule {
    return {
      module: Web3CoreModule,
      providers: [
        createClient(),
        { provide: WEB3_MODULE_OPTIONS, useValue: options },
      ],
      exports: [Web3Service],
    };
  }

  static forRootAsync(options: Web3ModuleAsyncOptions): DynamicModule {
    return {
      module: Web3CoreModule,
      imports: options.imports,
      providers: [createClient(), createAsyncClientOptions(options)],
      exports: [Web3Service],
    };
  }

  onModuleDestroy(): void {
    const closeConnection =
      ({ clients, key }: Web3Client) =>
      (options: Web3ModuleOptions) => {
        const name = options.name || key;
        const client = clients.get(name);

        if (client) {
          const provider = client.currentProvider as HttpProviderBase;
          provider.disconnect();
        }
      };

    const closeClientConnection = closeConnection(this.web3Client);

    if (Array.isArray(this.options)) {
      this.options.forEach(closeClientConnection);
    } else {
      closeClientConnection(this.options);
    }
  }
}
