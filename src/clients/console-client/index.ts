import { ConsoleParser } from '@tinystacks/ops-core';
import LocalConsoleClient from './local.js';
import IConsoleClient from './i-console-client.js';
import S3ConsoleClient from './s3.js';

/**
 * TODO: Eventually this becomes a proxy class which based on the environment returns a specific client i.e. local vs github vs s3 etc.
 */
class ConsoleClient implements IConsoleClient {
  getConsoles: () => Promise<ConsoleParser[]>;
  getConsole: (consoleName: string) => Promise<ConsoleParser>;
  saveConsole: (consoleName: string, console: ConsoleParser) => Promise<ConsoleParser>;
  public deleteConsole: (_consoleName: string) => Promise<ConsoleParser>;

  constructor () {
    const configPath = process.env.CONFIG_PATH;
    let client: IConsoleClient;
    if (configPath.startsWith('s3://')) {
      client = new S3ConsoleClient();
    } else {
      client = new LocalConsoleClient();
    }

    this.getConsole = client.getConsole.bind(client);
    this.getConsoles = client.getConsoles.bind(client);
    this.saveConsole = client.saveConsole.bind(client);
    this.deleteConsole = client.deleteConsole.bind(client);
  }
}

export default ConsoleClient;