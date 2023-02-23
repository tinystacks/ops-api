import { ConsoleParser } from '@tinystacks/ops-core';
import LocalConsoleClient from './local.js';

/**
 * TODO: Eventually this becomes a proxy class which based on the environment returns a specific client i.e. local vs github vs s3 etc.
 */
const ConsoleClient = {
  async getConsole (_consoleName: string): Promise<ConsoleParser> {
    // TODO: Add switching based on context for sourcing from other places.
    return LocalConsoleClient.getLocalConsole();
  },
  async getConsoles (): Promise<ConsoleParser[]> {
    // TODO: Add switching based on context for sourcing from other places.
    const consoles = [];
    const localConsole = await LocalConsoleClient.getLocalConsole();
    if (localConsole) consoles.push(localConsole);
    return consoles;
  },
  async saveConsole (_consoleName: string, console: ConsoleParser): Promise<ConsoleParser> {
    // TODO: Add switching based on context for sourcing from other places.
    return LocalConsoleClient.saveLocalConsole(console);
  },
  async deleteConsole (consoleName: string): Promise<ConsoleParser> {
    // TODO: Add switching based on context for sourcing from other places.
    return LocalConsoleClient.deleteLocalConsole(consoleName);
  }
};

export default ConsoleClient;