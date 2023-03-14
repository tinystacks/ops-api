import { Console as ConsoleType } from '@tinystacks/ops-model';
import ConsoleClient from '../clients/console-client/index.js';
import { ConsoleParser } from '@tinystacks/ops-core';

const ConsoleController = {
  async getConsoles (): Promise<ConsoleType[]> {
    const consoleClient = new ConsoleClient();
    const consoles: ConsoleParser[] = await consoleClient.getConsoles();
    const consoleTypes: ConsoleType[] = consoles.map( (console) => { 
      return console.toJson();
    }); 
    return consoleTypes;
  },
  async postConsole (createConsoleBody: ConsoleType): Promise<ConsoleType> {
    const console: ConsoleParser = await ConsoleParser.fromJson(createConsoleBody);
    const consoleClient = new ConsoleClient();
    const newConsole = await consoleClient.saveConsole(console.name, console);
    return newConsole.toJson();
  },
  async putConsole (consoleName: string, updateConsoleBody: ConsoleType): Promise<ConsoleType> {
    const console: ConsoleParser = await ConsoleParser.fromJson(updateConsoleBody);
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