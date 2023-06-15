import { Console } from '@tinystacks/ops-core';

interface IConsoleClient {
  getConsoles (): Promise<Console[]>;
  getConsole (consoleName: string): Promise<Console>;
  saveConsole (consoleName: string, console: Console): Promise<Console>;
  deleteConsole (consoleName: string): Promise<Console>;
}

export {
  IConsoleClient
};

export default IConsoleClient;