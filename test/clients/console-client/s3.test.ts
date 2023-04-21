const mockTryToReadFile = jest.fn();
const mockLoad = jest.fn();
const mockDump = jest.fn();
const mockMkdirSync = jest.fn();
const mockRmSync = jest.fn();
const mockWriteFileSync = jest.fn();
const mockS3 = jest.fn();
const mockListObjectsV2 = jest.fn();
const mockGetObject = jest.fn();
const mockPutObject = jest.fn();
const mockDeleteObject = jest.fn();

jest.mock('../../../src/utils/fs-utils.ts', () => ({
  tryToReadFile: mockTryToReadFile
}));

jest.mock('js-yaml', () => ({
  load: mockLoad,
  dump: mockDump
}));

jest.mock('fs', () => ({
  mkdirSync: mockMkdirSync,
  rmSync: mockRmSync,
  writeFileSync: mockWriteFileSync
}));

jest.mock('@aws-sdk/client-s3', () => ({
  S3: mockS3
}));

const mockGetConsole = jest.fn();

import { Console } from '@tinystacks/ops-model';
import S3ConsoleClient from '../../../src/clients/console-client/s3';
import HttpError from 'http-errors';
import { ConsoleParser } from '@tinystacks/ops-core';

const mockConsoleName = 'mock-console';
const mockConsoleJson: Console = {
  name: mockConsoleName,
  dashboards: {},
  providers: {},
  widgets: {},
  dependencies: {}
};

const mockConfigYaml = `Console: name: ${mockConsoleName}`;
const mockConfigBucket = 'mock-config-bucket';
const mockUser = 'mock-user';
const mockConfigFileName = 'mock-config.yml';

const mockS3Client = {
  listObjectsV2: mockListObjectsV2,
  getObject: mockGetObject,
  putObject: mockPutObject,
  deleteObject: mockDeleteObject
};

let s3ConsoleClient: S3ConsoleClient;
describe('local console client tests', () => {
  beforeEach(() => {
    delete process.env.CONFIG_PATH;
    mockS3.mockReturnValue(mockS3Client);
    s3ConsoleClient = new S3ConsoleClient();
  });
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();

    // for spies
    jest.restoreAllMocks();
  });
  describe('getConsole', () => {
    it('throws InternalServerError if CONFIG_PATH is not set', async () => {
      let thrownError;
      try {
        await s3ConsoleClient.getConsole();
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockTryToReadFile).not.toBeCalled();
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(HttpError.InternalServerError('Cannot fetch console! No value was found for CONFIG_PATH!'));
      }
    });
    it('throws NotFound if file returns undefined', async () => {
      const mockConfigPath = `s3://${mockConfigBucket}/${mockUser}/${mockConfigFileName}`;
      process.env.CONFIG_PATH = mockConfigPath;
      mockListObjectsV2.mockResolvedValueOnce({});
      mockTryToReadFile.mockReturnValueOnce(undefined);
      let thrownError;
      try {
        await s3ConsoleClient.getConsole();
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockTryToReadFile).toBeCalled();
        expect(mockTryToReadFile).toBeCalledWith('/tmp/ops-api/mock-user/mock-config.yml');
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(HttpError.NotFound('Cannot fetch console! Config file s3://mock-config-bucket/mock-user/mock-config.yml not found!'));
      }
    });
    it('pulls entire directory if config file has a parent directory', async () => {
      const mockConfigPath = `s3://${mockConfigBucket}/${mockUser}/${mockConfigFileName}`;
      const mockConsole = { ...mockConsoleJson };
      process.env.CONFIG_PATH = mockConfigPath;
      mockListObjectsV2.mockResolvedValueOnce({
        Contents: [
          {
            Size: 100,
            Key: 'mock-user/mock-config.yml'
          },
          {
            Size: 100,
            Key: 'mock-user/extra.yml'
          }
        ]
      });
      mockGetObject.mockResolvedValue({
        Body: {
          transformToString: () => mockConfigYaml
        }
      });
      mockTryToReadFile.mockReturnValueOnce(Buffer.from(mockConfigYaml));
      mockLoad.mockReturnValueOnce({
        Console: mockConsole
      });

      const result = await s3ConsoleClient.getConsole();

      expect(mockListObjectsV2).toBeCalled();
      expect(mockListObjectsV2).toBeCalledTimes(1);
      expect(mockListObjectsV2).toBeCalledWith({
        Bucket: mockConfigBucket,
        Prefix: mockUser
      });

      expect(mockMkdirSync).toBeCalled();
      expect(mockMkdirSync).toBeCalledTimes(2);
      expect(mockMkdirSync).toBeCalledWith('/tmp/ops-api', { recursive: true });
      expect(mockMkdirSync).toBeCalledWith('/tmp/ops-api/mock-user', { recursive: true });

      expect(mockGetObject).toBeCalled();
      expect(mockGetObject).toBeCalledTimes(2);
      expect(mockGetObject).toBeCalledWith({
        Bucket: mockConfigBucket,
        Key: 'mock-user/mock-config.yml'
      });
      expect(mockGetObject).toBeCalledWith({
        Bucket: mockConfigBucket,
        Key: 'mock-user/extra.yml'
      });

      expect(mockWriteFileSync).toBeCalled();
      expect(mockWriteFileSync).toBeCalledTimes(2);
      expect(mockWriteFileSync).toBeCalledWith('/tmp/ops-api/mock-user/mock-config.yml', mockConfigYaml);
      expect(mockWriteFileSync).toBeCalledWith('/tmp/ops-api/mock-user/extra.yml', mockConfigYaml);

      expect(mockTryToReadFile).toBeCalled();
      expect(mockTryToReadFile).toBeCalledWith('/tmp/ops-api/mock-user/mock-config.yml');
      expect(mockLoad).toBeCalled();
      expect(mockLoad).toBeCalledWith(mockConfigYaml);
      expect(result).toEqual(mockConsole);
    });
    it('only pulls file if there is no parent directory', async () => {
      const mockConfigPath = `s3://${mockConfigBucket}/${mockConfigFileName}`;
      const mockConsole = { ...mockConsoleJson };
      process.env.CONFIG_PATH = mockConfigPath;
      mockGetObject.mockResolvedValueOnce({
        Body: {
          transformToString: () => mockConfigYaml
        }
      });
      mockTryToReadFile.mockReturnValueOnce(Buffer.from(mockConfigYaml));
      mockLoad.mockReturnValueOnce({
        Console: mockConsole
      });

      const result = await s3ConsoleClient.getConsole();

      expect(mockListObjectsV2).not.toBeCalled();

      expect(mockMkdirSync).toBeCalled();
      expect(mockMkdirSync).toBeCalledTimes(1);
      expect(mockMkdirSync).toBeCalledWith('/tmp/ops-api', { recursive: true });

      expect(mockGetObject).toBeCalled();
      expect(mockGetObject).toBeCalledTimes(1);
      expect(mockGetObject).toBeCalledWith({
        Bucket: mockConfigBucket,
        Key: mockConfigFileName
      });

      expect(mockWriteFileSync).toBeCalled();
      expect(mockWriteFileSync).toBeCalledTimes(1);
      expect(mockWriteFileSync).toBeCalledWith('/tmp/ops-api/mock-config.yml', mockConfigYaml);

      expect(mockTryToReadFile).toBeCalled();
      expect(mockTryToReadFile).toBeCalledWith('/tmp/ops-api/mock-config.yml');
      expect(mockLoad).toBeCalled();
      expect(mockLoad).toBeCalledWith(mockConfigYaml);
      expect(result).toEqual(mockConsole);
    });
    it('throws InternalServerError if yaml cannot be loaded', async () => {
      const mockConfigPath = `s3://${mockConfigBucket}/${mockConfigFileName}`;
      process.env.CONFIG_PATH = mockConfigPath;
      mockGetObject.mockResolvedValueOnce({
        Body: {
          transformToString: () => mockConfigYaml
        }
      });
      mockTryToReadFile.mockReturnValueOnce(Buffer.from(mockConfigYaml));
      mockLoad.mockReturnValueOnce(undefined);
      let thrownError;
      try {
        await s3ConsoleClient.getConsole();
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockTryToReadFile).toBeCalled();
        expect(mockTryToReadFile).toBeCalledWith('/tmp/ops-api/mock-config.yml');
        expect(mockLoad).toBeCalled();
        expect(mockLoad).toBeCalledWith(mockConfigYaml);
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(HttpError.InternalServerError('Cannot fetch console! The contents of the config file was empty or invalid!'));
      }
    });
  });
  describe('getConsoles', () => {
    it('returns array of console if one exists', async () => {
      const mockConsole = await ConsoleParser.fromJson(mockConsoleJson);
      jest.spyOn(S3ConsoleClient.prototype, 'getConsole').mockResolvedValue(mockConsole);

      const result = await s3ConsoleClient.getConsoles();

      expect(S3ConsoleClient.prototype.getConsole).toBeCalled();
      expect(result).toEqual([mockConsole]);
    });
    it('returns empty array if console does not exist', async () => {
      // @ts-ignore
      jest.spyOn(S3ConsoleClient.prototype, 'getConsole').mockResolvedValue(undefined);

      const result = await s3ConsoleClient.getConsoles();

      expect(S3ConsoleClient.prototype.getConsole).toBeCalled();
      expect(result).toEqual([]);
    });
  });
  describe('saveConsole', () => {
    it('throws InternalServerError if CONFIG_PATH is not set', async () => {
      const mockConsole = await ConsoleParser.fromJson(mockConsoleJson);
      jest.spyOn(S3ConsoleClient.prototype, 'getConsole').mockResolvedValue(mockConsole);
      let thrownError;
      try {
        await s3ConsoleClient.saveConsole(mockConsoleName, mockConsole);
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockTryToReadFile).not.toBeCalled();
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(HttpError.InternalServerError('Cannot save console mock-console! No value was found for CONFIG_PATH!'));
      }
    });
    it('writes to file and returns saved Console on success', async () => {
      const mockConfigPath = `s3://${mockConfigBucket}/${mockUser}/${mockConfigFileName}`;
      const mockConsole = await ConsoleParser.fromJson(mockConsoleJson);

      process.env.CONFIG_PATH = mockConfigPath;
      mockDump.mockReturnValueOnce(mockConfigYaml);
      jest.spyOn(S3ConsoleClient.prototype, 'getConsole').mockResolvedValue(mockConsole);

      const result = await s3ConsoleClient.saveConsole(mockConsoleName, mockConsole);

      expect(mockDump).toBeCalled();
      expect(mockDump).toBeCalledWith({
        Console: mockConsole.toYaml()
      });

      expect(mockMkdirSync).toBeCalled();
      expect(mockMkdirSync).toBeCalledTimes(1);
      expect(mockMkdirSync).toBeCalledWith('/tmp/ops-api/mock-user', { recursive: true });

      expect(mockWriteFileSync).toBeCalled();
      expect(mockWriteFileSync).toBeCalledTimes(1);
      expect(mockWriteFileSync).toBeCalledWith('/tmp/ops-api/mock-user/mock-config.yml', mockConfigYaml);

      expect(mockPutObject).toBeCalled();
      expect(mockPutObject).toBeCalledTimes(1);
      expect(mockPutObject).toBeCalledWith({
        Bucket: mockConfigBucket,
        Key: 'mock-user/mock-config.yml',
        Body: mockConfigYaml
      });

      expect(S3ConsoleClient.prototype.getConsole).toBeCalled();
      expect(result).toEqual(mockConsole);
    });
    it('logs and re-throws errors', async () => {
      const mockConfigPath = `s3://${mockConfigBucket}/${mockUser}/${mockConfigFileName}`;
      const mockConsole = await ConsoleParser.fromJson(mockConsoleJson);
      jest.spyOn(S3ConsoleClient.prototype, 'getConsole').mockResolvedValue(mockConsole);
      const mockError = new Error();
      process.env.CONFIG_PATH = mockConfigPath;
      mockWriteFileSync.mockImplementationOnce(() => { throw mockError; });
      jest.spyOn(global.console, 'error').mockImplementationOnce(jest.fn());

      let thrownError;
      try {
        await s3ConsoleClient.saveConsole(mockConsoleName, mockConsole);
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockDump).toBeCalled();
        expect(mockMkdirSync).toBeCalled();
        expect(mockWriteFileSync).toBeCalled();
        expect(mockGetConsole).not.toBeCalled();
        expect(global.console.error).toBeCalled();
        expect(global.console.error).toBeCalledWith('Failed to save local console mock-console!', mockError);
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(mockError);
      }
    });
  });
  describe('deleteConsole', () => {
    it('throws InternalServerError if CONFIG_PATH is not set', async () => {
      let thrownError;
      try {
        await s3ConsoleClient.deleteConsole(mockConsoleName);
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockTryToReadFile).not.toBeCalled();
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(HttpError.InternalServerError('Cannot delete console mock-console! No value was found for CONFIG_PATH!'));
      }
    });
    it('deletes all objects in the directory if config file has a parent directory', async () => {
      const mockConfigPath = `s3://${mockConfigBucket}/${mockUser}/${mockConfigFileName}`;
      const mockConsole = await ConsoleParser.fromJson(mockConsoleJson);
      process.env.CONFIG_PATH = mockConfigPath;
      mockListObjectsV2.mockResolvedValueOnce({
        Contents: [
          {
            Size: 100,
            Key: 'mock-user/mock-config.yml'
          },
          {
            Size: 100,
            Key: 'mock-user/extra.yml'
          }
        ]
      });
      jest.spyOn(S3ConsoleClient.prototype, 'getConsole').mockResolvedValueOnce(mockConsole);

      const result = await s3ConsoleClient.deleteConsole(mockConsoleName);

      expect(S3ConsoleClient.prototype.getConsole).toBeCalled();

      expect(mockListObjectsV2).toBeCalled();
      expect(mockListObjectsV2).toBeCalledWith({
        Bucket: mockConfigBucket,
        Prefix: mockUser
      });

      expect(mockDeleteObject).toBeCalled();
      expect(mockDeleteObject).toBeCalledTimes(2);
      expect(mockDeleteObject).toBeCalledWith({
        Bucket: mockConfigBucket,
        Key: 'mock-user/mock-config.yml'
      });
      expect(mockDeleteObject).toBeCalledWith({
        Bucket: mockConfigBucket,
        Key: 'mock-user/extra.yml'
      });

      expect(mockRmSync).toBeCalled();
      expect(mockRmSync).toBeCalledTimes(2);
      expect(mockRmSync).toBeCalledWith('/tmp/ops-api/mock-user/mock-config.yml', { recursive: true, force: true });
      expect(mockRmSync).toBeCalledWith('/tmp/ops-api/mock-user/extra.yml', { recursive: true, force: true });


      expect(result).toEqual(mockConsole);
    });
    it('deletes single object if config file does not have a parent directory', async () => {
      const mockConfigPath = `s3://${mockConfigBucket}/${mockUser}/${mockConfigFileName}`;
      const mockConsole = await ConsoleParser.fromJson(mockConsoleJson);
      process.env.CONFIG_PATH = mockConfigPath;
      mockListObjectsV2.mockResolvedValueOnce({
        Contents: [
          {
            Size: 100,
            Key: 'mock-user/mock-config.yml'
          },
          {
            Size: 100,
            Key: 'mock-user/extra.yml'
          }
        ]
      });
      jest.spyOn(S3ConsoleClient.prototype, 'getConsole').mockResolvedValueOnce(mockConsole);

      const result = await s3ConsoleClient.deleteConsole(mockConsoleName);

      expect(S3ConsoleClient.prototype.getConsole).toBeCalled();

      expect(mockListObjectsV2).toBeCalled();
      expect(mockListObjectsV2).toBeCalledWith({
        Bucket: mockConfigBucket,
        Prefix: mockUser
      });

      expect(mockDeleteObject).toBeCalled();
      expect(mockDeleteObject).toBeCalledTimes(2);
      expect(mockDeleteObject).toBeCalledWith({
        Bucket: mockConfigBucket,
        Key: 'mock-user/mock-config.yml'
      });
      expect(mockDeleteObject).toBeCalledWith({
        Bucket: mockConfigBucket,
        Key: 'mock-user/extra.yml'
      });

      expect(mockRmSync).toBeCalled();
      expect(mockRmSync).toBeCalledTimes(2);
      expect(mockRmSync).toBeCalledWith('/tmp/ops-api/mock-user/mock-config.yml', { recursive: true, force: true });
      expect(mockRmSync).toBeCalledWith('/tmp/ops-api/mock-user/extra.yml', { recursive: true, force: true });


      expect(result).toEqual(mockConsole);
    });
    it('logs and re-throws errors', async () => {
      const mockConfigPath = `s3://${mockConfigBucket}/${mockUser}/${mockConfigFileName}`;
      const mockConsole = await ConsoleParser.fromJson(mockConsoleJson);
      const mockError = new Error();
      process.env.CONFIG_PATH = mockConfigPath;
      mockListObjectsV2.mockImplementationOnce(() => { throw mockError; });
      jest.spyOn(S3ConsoleClient.prototype, 'getConsole').mockResolvedValueOnce(mockConsole);
      jest.spyOn(global.console, 'error').mockImplementationOnce(jest.fn());

      let thrownError;
      try {
        await s3ConsoleClient.deleteConsole(mockConsoleName);
      } catch (error) {
        thrownError = error;
      } finally {
        expect(s3ConsoleClient.getConsole).toBeCalled();
        expect(mockListObjectsV2).toBeCalled();

        expect(mockDeleteObject).not.toBeCalled();
        expect(mockRmSync).not.toBeCalled();

        expect(global.console.error).toBeCalled();
        expect(global.console.error).toBeCalledWith('Failed to delete local console mock-console!', mockError);
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(mockError);
      }
    });
  });
});