import yaml from 'js-yaml';
import isNil from 'lodash.isnil';
import { ConsoleParser } from '@tinystacks/ops-core';
import { Console as ConsoleType, YamlConsole } from '@tinystacks/ops-model';
import HttpError from 'http-errors';
import {
  writeFileSync
} from 'fs';
import {
  resolve as resolvePath
} from 'path';
import FsUtils from '../../utils/fs-utils.js';

// TODO: should we make this a class that implement a ConsoleClient interface?
const LocalConsoleClient = {
  async getLocalConsole (): Promise<ConsoleParser> {
    const configPath = process.env.CONFIG_PATH;
    if (configPath) {
      const configFilePath = resolvePath(configPath);
      // console.debug('configFilePath: ', configFilePath);
      const configFile = FsUtils.tryToReadFile(configFilePath);
      if (!configFile) throw HttpError.NotFound(`Cannot fetch consoles! Config file ${configPath} not found!`);
      const configJson = (yaml.load(configFile.toString()) as any).Console as YamlConsole;
      // console.debug('configJson: ', JSON.stringify(configJson));
      if (!isNil(configJson)) {
        const consoleType: ConsoleType = ConsoleParser.parse(configJson); 
        return ConsoleParser.fromJson(consoleType);
      }
      throw HttpError.InternalServerError('Cannot fetch consoles! The contents of the config file was empty or invalid!');
    }
    throw HttpError.InternalServerError('Cannot fetch consoles! No value was found for CONFIG_PATH!');
  },
  async saveLocalConsole (console: ConsoleParser): Promise<ConsoleParser> {
    const yamlConsole = await ConsoleParser.toYaml(console);
    const consoleYml = yaml.dump({ Console: yamlConsole });
    const configPath = process.env.CONFIG_PATH;
    if (isNil(configPath)) throw HttpError.InternalServerError(`Cannot save console ${console.name}! No value was found for CONFIG_PATH!`);
    try {
      writeFileSync(resolvePath(configPath), consoleYml);
      return this.getLocalConsole();
    } catch (error) {
      const message = `Failed to save local console ${console.name}!`;
      global.console.error(message, error);
      throw error;
    }
  },
  async deleteLocalConsole (consoleName: string): Promise<ConsoleParser> {
    const configPath = process.env.CONFIG_PATH;
    if (isNil(configPath)) throw HttpError.InternalServerError(`Cannot delete console ${consoleName}! No value was found for CONFIG_PATH!`);
    try {
      const console = this.getLocalConsole();
      writeFileSync(resolvePath(configPath), '');
      return console;
    } catch (error) {
      const message = `Failed to delete local console ${consoleName}!`;
      global.console.error(message, error);
      throw error;
    }
  }
};

export default LocalConsoleClient;