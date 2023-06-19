import isNil from 'lodash.isnil';
import { ConsoleParser } from '@tinystacks/ops-core';
import { Config, Console as ConsoleType, YamlConsole } from '@tinystacks/ops-model';
import HttpError from 'http-errors';
import {
  mkdirSync,
  rmSync,
  writeFileSync
} from 'fs';
import { S3 } from '@aws-sdk/client-s3';
import FsUtils from '../../utils/fs-utils.js';
import IConsoleClient from './i-console-client.js';
import { TMP_DIR } from '../../constants.js';
import Yaml from '../../utils/yaml.js';

type S3Info = {
  bucketName: string;
  parentDirectory: string;
  fileName: string;
  filePath: string;
  isDirectory: boolean;
};

class S3ConsoleClient implements IConsoleClient {
  private s3Client: S3;

  constructor () {
    this.s3Client = new S3({});
  }

  private getS3Info (): S3Info {
    const configPath = process.env.CONFIG_PATH;
    if (!configPath) return {} as S3Info;
    const [ _s3, _empty, bucketName, ...pathElems] = configPath.split('/');
    const originalFilePath = pathElems.join('/');
    const lastPathElem = pathElems.at(-1);
    const lastPathElemIsFile = lastPathElem?.endsWith('.yml');
    const isDirectory = !(lastPathElem && lastPathElemIsFile);
    const fileName = isDirectory ? 'index.yml' : lastPathElem;
    const filePath = isDirectory ? `${originalFilePath}/${fileName}` : originalFilePath;
    const parentDirectory = isDirectory ? originalFilePath : pathElems.slice(0, -1).join('/');
    const s3Info: S3Info = {
      bucketName,
      parentDirectory,
      filePath,
      fileName,
      isDirectory
    };
    return s3Info;
  }

  private async listObjectsRecursively (bucketName: string, directory: string, nextToken?: string, accumulator: string[] = []): Promise<string[]> {
    const listObjectsResponse = await this.s3Client.listObjectsV2({
      Bucket: bucketName,
      Prefix: directory,
      ContinuationToken: nextToken
    });

    const {
      ContinuationToken,
      Contents = []
    } = listObjectsResponse;

    accumulator.push(
      ...Contents
        .filter(content => content.Size > 0)
        .map(content => content.Key)
    );

    if (ContinuationToken) {
      return this.listObjectsRecursively(bucketName, directory, ContinuationToken, accumulator);
    }
    return accumulator;
  }

  private async getConfig () {
    const {
      bucketName,
      parentDirectory,
      filePath,
      isDirectory
    } = this.getS3Info();

    mkdirSync(TMP_DIR, { recursive: true });

    if (isDirectory || parentDirectory.length > 0) {
      const directoryContents = await this.listObjectsRecursively(bucketName, parentDirectory);

      const existingDirs: string[] = [];
      for (const file of directoryContents) {
        const filePathElems = file.split('/');
        // remove file name from path
        filePathElems.pop();
        if (filePathElems.length > 0) {
          const subdir = filePathElems.join('/');
          if (!existingDirs.includes(subdir)) {
            mkdirSync(`${TMP_DIR}/${subdir}`, { recursive: true });
            existingDirs.push(subdir);
          }
        }

        const fileObject = await this.s3Client.getObject({
          Bucket: bucketName,
          Key: file
        });
        const fileContents = await fileObject.Body.transformToString();
        writeFileSync(`${TMP_DIR}/${file}`, fileContents);
      }
    } else {
      const getObjectResponse = await this.s3Client.getObject({
        Bucket: bucketName,
        Key: filePath
      });

      const config = await getObjectResponse.Body.transformToString();

      writeFileSync(`${TMP_DIR}/${filePath}`, config);
    }

    const configFilePath = `${TMP_DIR}/${filePath}`;
    return FsUtils.tryToReadFile(configFilePath);
  }

  // TODO: Actually handle multiple files
  private async saveConfig (consoleYaml: string) {
    const {
      bucketName,
      parentDirectory,
      filePath
    } = this.getS3Info();
    mkdirSync([TMP_DIR, parentDirectory].join('/'), { recursive: true });

    const configFilePath = `${TMP_DIR}/${filePath}`;
    writeFileSync(configFilePath, consoleYaml);

    await this.s3Client.putObject({
      Bucket: bucketName,
      Key: filePath,
      Body: consoleYaml
    });
  }

  private async deleteConfig () {
    const {
      bucketName,
      parentDirectory,
      filePath,
      isDirectory
    } = this.getS3Info();

    if (isDirectory || parentDirectory.length > 0) {
      const directoryContents = await this.listObjectsRecursively(bucketName, parentDirectory);

      for (const file of directoryContents) {
        await this.s3Client.deleteObject({
          Bucket: bucketName,
          Key: file
        });
        rmSync(`${TMP_DIR}/${file}`, { recursive: true, force: true });
      }
    } else {
      await this.s3Client.deleteObject({
        Bucket: bucketName,
        Key: filePath
      });
      rmSync(`${TMP_DIR}/${filePath}`, { recursive: true, force: true });
    }
  }

  async getConsole (_consoleName?: string): Promise<ConsoleParser> {
    const configPath = process.env.CONFIG_PATH;
    if (configPath) {
      /**
       * TODO: There's probably lots of room for refactoring here.
       * We can probably re-use the local client on top of the tmp directory created by this s3 client so the below code isn't as duplicative?
       * Something to think about later anyways
       */
      const configFile = await this.getConfig();
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
      await this.saveConfig(consoleYml);
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
      const console = this.getConsole();
      await this.deleteConfig();
      return console;
    } catch (error) {
      const message = `Failed to delete local console ${consoleName}!`;
      global.console.error(message, error);
      throw error;
    }
  }
}

export {
  S3ConsoleClient
};
export default S3ConsoleClient;