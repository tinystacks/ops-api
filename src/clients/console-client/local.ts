import isNil from 'lodash.isnil';
import { ConsoleParser } from '@tinystacks/ops-core';
import { Config, Console as ConsoleType, YamlConsole } from '@tinystacks/ops-model';
import HttpError from 'http-errors';
import {
  writeFileSync
} from 'fs';
import {
  resolve as resolvePath
} from 'path';
import FsUtils from '../../utils/fs-utils.js';
import IConsoleClient from './i-console-client.js';
import Yaml from '../../utils/yaml.js';

class LocalConsoleClient implements IConsoleClient {
  async getConsole (_consoleName?: string): Promise<ConsoleParser> {
    const configPath = process.env.CONFIG_PATH;
    if (configPath) {
      const configFilePath = resolvePath(configPath);
      // console.debug('configFilePath: ', configFilePath);
      const configFile = FsUtils.tryToReadFile(configFilePath);
      if (!configFile) throw HttpError.NotFound(`Cannot fetch console! Config file ${configPath} not found!`);
      const configJson = Yaml.parseAs<Config>(configFile.toString());
      // console.debug('configJson: ', JSON.stringify(configJson));
      if (!isNil(configJson?.Console)) {
        const consoleType: ConsoleType = ConsoleParser.parse(configJson?.Console as YamlConsole);
        return ConsoleParser.fromJson(consoleType);
      }
      throw HttpError.InternalServerError('Cannot fetch console! The contents of the config file was empty or invalid!');
    }
    throw HttpError.InternalServerError('Cannot fetch console! No value was found for CONFIG_PATH!');
  }
  async getConsoles (): Promise<ConsoleParser[]> {
    const consoles = [];
    const console = await this.getConsole();
    if (console) consoles.push(console);
    return consoles;
  }
  async saveConsole (consoleName: string, console: ConsoleParser): Promise<ConsoleParser> {
    console.name = consoleName;
    const previousConsole = await this.getConsole(consoleName);
    console.providers = previousConsole.providers;
    const yamlConsole = await console.toYaml();
    const consoleYml = Yaml.stringify({ Console: yamlConsole });
    const configPath = process.env.CONFIG_PATH;
    if (isNil(configPath)) throw HttpError.InternalServerError(`Cannot save console ${console.name}! No value was found for CONFIG_PATH!`);
    try {
      writeFileSync(resolvePath(configPath), consoleYml);
      return this.getConsole();
    } catch (error) {
      const message = `Failed to save local console ${console.name}!`;
      global.console.error(message, error);
      throw error;
    }
  }
  async deleteConsole (consoleName: string): Promise<ConsoleParser> {
    const configPath = process.env.CONFIG_PATH;
    if (isNil(configPath)) throw HttpError.InternalServerError(`Cannot delete console ${consoleName}! No value was found for CONFIG_PATH!`);
    try {
      const console = await this.getConsole();
      writeFileSync(resolvePath(configPath), '');
      return console;
    } catch (error) {
      const message = `Failed to delete local console ${consoleName}!`;
      global.console.error(message, error);
      throw error;
    }
  }
}

export {
  LocalConsoleClient
};
export default LocalConsoleClient;