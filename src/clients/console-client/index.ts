import { ConsoleParser } from '@tinystacks/ops-core';
import IConsoleClient from './i-console-client.js';
import { LocalConsoleClient } from './local.js';
import { S3ConsoleClient } from './s3.js';

/**
 * TODO: Eventually this becomes a proxy class which based on the environment returns a specific client i.e. local vs github vs s3 etc.
 */
class ConsoleClient implements IConsoleClient {
  client: IConsoleClient;
  async getConsoles (): Promise<ConsoleParser[]> {
    return this.client.getConsoles();
  }

  async getConsole (consoleName: string): Promise<ConsoleParser> {
    return this.client.getConsole(consoleName);
  }

  async saveConsole (consoleName: string, console: ConsoleParser): Promise<ConsoleParser> {
    return this.client.saveConsole(consoleName, console);
  }

  async deleteConsole (consoleName: string): Promise<ConsoleParser> {
    return this.client.deleteConsole(consoleName);
  }

  constructor () {
    const configPath = process.env.CONFIG_PATH;
    if (!!configPath && configPath.startsWith('s3://')) {
      this.client = new S3ConsoleClient();
    } else {
      this.client = new LocalConsoleClient();
    }

    // TODO: Re-enable once we can get bind to play nicely with jest
    this.getConsole = this.client.getConsole.bind(this.client);
    this.getConsoles = this.client.getConsoles.bind(this.client);
    this.saveConsole = this.client.saveConsole.bind(this.client);
    this.deleteConsole = this.client.deleteConsole.bind(this.client);
  }
}

export default ConsoleClient;