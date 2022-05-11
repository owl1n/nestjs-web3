import { Inject, Injectable } from '@nestjs/common';
import { Web3Client, Web3ClientError } from './web3-client.provider';
import { WEB3_CLIENT } from './web3.constants';
import Web3 from 'web3';

@Injectable()
export class Web3Service {
  constructor(
    @Inject(WEB3_CLIENT)
    private readonly web3Client: Web3Client,
  ) {}

  getClient(name?: string): Web3 {
    if (!name) {
      name = this.web3Client.key;
    }

    if (!this.web3Client.clients.has(name)) {
      throw new Web3ClientError(`Client ${name} doesnt exists`);
    }

    return this.web3Client.clients.get(name);
  }

  getClients(): Map<string, Web3> {
    return this.web3Client.clients;
  }
}
