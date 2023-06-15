import { Console } from '@tinystacks/ops-core';
import IConsoleClient from './i-console-client.js';
import { LocalConsoleClient } from './local.js';
import { S3ConsoleClient } from './s3.js';

class ConsoleClient implements IConsoleClient {
  client: IConsoleClient;
  getConsoles: () => Promise<Console[]>;
  getConsole: (consoleName: string) => Promise<Console>;
  saveConsole: (consoleName: string, console: Console) => Promise<Console>;
  deleteConsole: (_consoleName: string) => Promise<Console>;

  constructor () {
    const configPath = process.env.CONFIG_PATH;
    if (!!configPath && configPath.startsWith('s3://')) {
      this.client = new S3ConsoleClient();
    } else {
      this.client = new LocalConsoleClient();
    }

    this.getConsole = this.client.getConsole.bind(this.client);
    this.getConsoles = this.client.getConsoles.bind(this.client);
    this.saveConsole = this.client.saveConsole.bind(this.client);
    this.deleteConsole = this.client.deleteConsole.bind(this.client);
  }
}

export default ConsoleClient;