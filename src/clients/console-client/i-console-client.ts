import { ConsoleParser } from '@tinystacks/ops-core';

interface IConsoleClient {
  getConsoles (): Promise<ConsoleParser[]>;
  getConsole (consoleName: string): Promise<ConsoleParser>;
  saveConsole (consoleName: string, console: ConsoleParser): Promise<ConsoleParser>;
  deleteConsole (consoleName: string): Promise<ConsoleParser>;
}

export {
  IConsoleClient
};

export default IConsoleClient;