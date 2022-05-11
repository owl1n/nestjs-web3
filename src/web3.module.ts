import { Web3ModuleAsyncOptions, Web3ModuleOptions } from './web3.interface';
import { DynamicModule, Module } from '@nestjs/common';
import { Web3CoreModule } from './web3-core.module';

@Module({})
export class Web3Module {
  static forRoot(
    options: Web3ModuleOptions | Web3ModuleOptions[],
  ): DynamicModule {
    return {
      module: Web3Module,
      imports: [Web3CoreModule.register(options)],
    };
  }

  static forRootAsync(options: Web3ModuleAsyncOptions): DynamicModule {
    return {
      module: Web3Module,
      imports: [Web3CoreModule.forRootAsync(options)],
    };
  }
}
