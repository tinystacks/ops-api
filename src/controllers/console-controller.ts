import { Console as ConsoleType } from '@tinystacks/ops-model';
import { Console } from '@tinystacks/ops-core';
import ConsoleClient from '../clients/console-client/index.js';

const ConsoleController = {
  async getConsoles (): Promise<ConsoleType[]> {
    const consoleClient = new ConsoleClient();
    const consoles: Console[] = await consoleClient.getConsoles();
    const consoleTypes: ConsoleType[] = consoles.map( (console) => {
      return console.toJson();
    });
    return consoleTypes;
  },
  async postConsole (createConsoleBody: ConsoleType): Promise<ConsoleType> {
    const console: Console = await Console.fromJson(createConsoleBody);
    const consoleClient = new ConsoleClient();
    const newConsole = await consoleClient.saveConsole(console.name, console);
    return newConsole.toJson();
  },
  async putConsole (consoleName: string, updateConsoleBody: ConsoleType): Promise<ConsoleType> {
    const console: Console = await Console.fromJson(updateConsoleBody);
    const consoleClient = new ConsoleClient();
    const updatedConsole = await consoleClient.saveConsole(consoleName, console);
    return updatedConsole.toJson();
  },
  async deleteConsole (consoleName: string): Promise<ConsoleType> {
    const consoleClient = new ConsoleClient();
    const deletedConsole = await consoleClient.deleteConsole(consoleName);
    return deletedConsole.toJson();
  }
};

export default ConsoleController;