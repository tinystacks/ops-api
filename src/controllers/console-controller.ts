import { Console as ConsoleType } from '@tinystacks/ops-model';
import ConsoleClient from '../clients/console-client';
import { ConsoleParser } from '@tinystacks/ops-core';

const ConsoleController = {
  async getConsoles (): Promise<ConsoleType[]> {
    const consoles: ConsoleParser[] = await ConsoleClient.getConsoles();
    const consoleTypes: ConsoleType[] = consoles.map( (console) => { 
      return console.toJson();
    }); 
    return consoleTypes;
  },
  async postConsole (createConsoleBody: ConsoleType): Promise<ConsoleType> {
    const console: ConsoleParser = ConsoleParser.fromJson(createConsoleBody);
    return (await (ConsoleClient.saveConsole(console.name, console))).toJson();
  },
  async putConsole (consoleName: string, updateConsoleBody: ConsoleType): Promise<ConsoleType> {
    const console: ConsoleParser = ConsoleParser.fromJson(updateConsoleBody);
    console.name = consoleName;
    return (await ConsoleClient.saveConsole(consoleName, console)).toJson();
  },
  async deleteConsole (consoleName: string): Promise<ConsoleType> {
    return (await ConsoleClient.deleteConsole(consoleName)).toJson();
  }
};

export default ConsoleController;