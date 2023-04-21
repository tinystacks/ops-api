const mockResolve = jest.fn();
const mockTryToReadFile = jest.fn();
const mockLoad = jest.fn();
const mockDump = jest.fn();
const mockWriteFileSync = jest.fn();

jest.mock('../../../src/utils/fs-utils.ts', () => ({
  tryToReadFile: mockTryToReadFile
}));

jest.mock('path', () => ({
  resolve: mockResolve
}));

jest.mock('js-yaml', () => ({
  load: mockLoad,
  dump: mockDump
}));

jest.mock('fs', () => ({
  writeFileSync: mockWriteFileSync
}));

const mockGetConsole = jest.fn();

import { Console } from '@tinystacks/ops-model';
import LocalConsoleClient from '../../../src/clients/console-client/local';
import HttpError from 'http-errors';
import { ConsoleParser } from '@tinystacks/ops-core';

const mockConsoleName = 'mock-console';
const mockConsoleJson: Console = {
  name: mockConsoleName,
  constants: {},
  dashboards: {},
  providers: {},
  widgets: {},
  dependencies: {}
};

const mockConfigYaml = `Console: name: ${mockConsoleName}`;

let localConsoleClient: LocalConsoleClient;
describe('local console client tests', () => {
  beforeEach(() => {
    delete process.env.CONFIG_PATH;
    localConsoleClient = new LocalConsoleClient();
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
        await localConsoleClient.getConsole();
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockResolve).not.toBeCalled();
        expect(mockTryToReadFile).not.toBeCalled();
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(HttpError.InternalServerError('Cannot fetch console! No value was found for CONFIG_PATH!'));
      }
    });
    it('throws NotFound if file returns undefined', async () => {
      const mockConfigPath = './mock.yml';
      process.env.CONFIG_PATH = mockConfigPath;
      mockResolve.mockReturnValueOnce(mockConfigPath);
      mockTryToReadFile.mockReturnValueOnce(undefined);
      let thrownError;
      try {
        await localConsoleClient.getConsole();
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockResolve).toBeCalled();
        expect(mockResolve).toBeCalledWith(mockConfigPath);
        expect(mockTryToReadFile).toBeCalled();
        expect(mockTryToReadFile).toBeCalledWith(mockConfigPath);
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(HttpError.NotFound('Cannot fetch console! Config file ./mock.yml not found!'));
      }
    });
    it('returns Console on success', async () => {
      const mockConfigPath = './mock.yml';
      const mockConsole = { ...mockConsoleJson };
      process.env.CONFIG_PATH = mockConfigPath;
      mockResolve.mockReturnValueOnce(mockConfigPath);
      mockTryToReadFile.mockReturnValueOnce(Buffer.from('Console: '));
      mockLoad.mockReturnValueOnce({
        Console: mockConsole
      });

      const result = await localConsoleClient.getConsole();

      expect(mockResolve).toBeCalled();
      expect(mockResolve).toBeCalledWith(mockConfigPath);
      expect(mockTryToReadFile).toBeCalled();
      expect(mockTryToReadFile).toBeCalledWith(mockConfigPath);
      expect(mockLoad).toBeCalled();
      expect(mockLoad).toBeCalledWith('Console: ');
      expect(result).toEqual(mockConsole);
    });
    it('throws InternalServerError if yaml cannot be loaded', async () => {
      const mockConfigPath = './mock.yml';
      process.env.CONFIG_PATH = mockConfigPath;
      mockResolve.mockReturnValueOnce(mockConfigPath);
      mockTryToReadFile.mockReturnValueOnce(Buffer.from('Console: '));
      mockLoad.mockReturnValueOnce(undefined);
      let thrownError;
      try {
        await localConsoleClient.getConsole();
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockResolve).toBeCalled();
        expect(mockResolve).toBeCalledWith(mockConfigPath);
        expect(mockTryToReadFile).toBeCalled();
        expect(mockTryToReadFile).toBeCalledWith(mockConfigPath);
        expect(mockLoad).toBeCalled();
        expect(mockLoad).toBeCalledWith('Console: ');
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(HttpError.InternalServerError('Cannot fetch console! The contents of the config file was empty or invalid!'));
      }
    });
  });
  describe('getConsoles', () => {
    it('returns array of console if one exists', async () => {
      const mockConsole = await ConsoleParser.fromJson(mockConsoleJson);
      jest.spyOn(LocalConsoleClient.prototype, 'getConsole').mockResolvedValue(mockConsole);

      const result = await localConsoleClient.getConsoles();

      expect(LocalConsoleClient.prototype.getConsole).toBeCalled();
      expect(result).toEqual([mockConsole]);
    });
    it('returns empty array if console does not exist', async () => {
      jest.spyOn(LocalConsoleClient.prototype, 'getConsole').mockResolvedValue(undefined);

      const result = await localConsoleClient.getConsoles();

      expect(LocalConsoleClient.prototype.getConsole).toBeCalled();
      expect(result).toEqual([]);
    });
  });
  describe('saveConsole', () => {
    it('throws InternalServerError if CONFIG_PATH is not set', async () => {
      const mockConsole = await ConsoleParser.fromJson(mockConsoleJson);
      let thrownError;
      try {
        await localConsoleClient.saveConsole('mock-console', mockConsole);
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockResolve).not.toBeCalled();
        expect(mockTryToReadFile).not.toBeCalled();
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(HttpError.InternalServerError('Cannot save console mock-console! No value was found for CONFIG_PATH!'));
      }
    });
    it('writes to file and returns saved Console on success', async () => {
      const mockConfigPath = './mock.yml';
      const mockConsole = await ConsoleParser.fromJson(mockConsoleJson);

      process.env.CONFIG_PATH = mockConfigPath;
      mockResolve.mockReturnValueOnce(mockConfigPath);
      mockDump.mockReturnValueOnce(mockConfigYaml);
      jest.spyOn(LocalConsoleClient.prototype, 'getConsole').mockResolvedValueOnce(mockConsole);

      const result = await localConsoleClient.saveConsole('mock-console', mockConsole);

      expect(mockResolve).toBeCalled();
      expect(mockResolve).toBeCalledWith(mockConfigPath);
      expect(mockDump).toBeCalled();
      expect(mockDump).toBeCalledWith({
        Console: mockConsole.toYaml()
      });
      expect(mockWriteFileSync).toBeCalled();
      expect(mockWriteFileSync).toBeCalledWith(mockConfigPath, mockConfigYaml);
      expect(LocalConsoleClient.prototype.getConsole).toBeCalled();
      expect(result).toEqual(mockConsole);
    });
    it('logs and re-throws errors', async () => {
      const mockConfigPath = './mock.yml';
      const mockConsole = await ConsoleParser.fromJson(mockConsoleJson);
      const mockError = new Error();
      process.env.CONFIG_PATH = mockConfigPath;
      mockWriteFileSync.mockImplementationOnce(() => { throw mockError; });
      jest.spyOn(global.console, 'error').mockImplementationOnce(jest.fn());

      let thrownError;
      try {
        await localConsoleClient.saveConsole('mock-console', mockConsole);
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockDump).toBeCalled();
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
        await localConsoleClient.deleteConsole('mock-console');
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockResolve).not.toBeCalled();
        expect(mockTryToReadFile).not.toBeCalled();
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(HttpError.InternalServerError('Cannot delete console mock-console! No value was found for CONFIG_PATH!'));
      }
    });
    it('overwrites config file with empty string and returns previous Console state on success', async () => {
      const mockConfigPath = './mock.yml';
      const mockConsole = await ConsoleParser.fromJson(mockConsoleJson);
      process.env.CONFIG_PATH = mockConfigPath;
      mockResolve.mockReturnValueOnce(mockConfigPath);
      jest.spyOn(LocalConsoleClient.prototype, 'getConsole').mockResolvedValueOnce(mockConsole);

      const result = await localConsoleClient.deleteConsole('mock-console');

      expect(LocalConsoleClient.prototype.getConsole).toBeCalled();
      expect(mockResolve).toBeCalled();
      expect(mockResolve).toBeCalledWith(mockConfigPath);
      expect(mockWriteFileSync).toBeCalled();
      expect(mockWriteFileSync).toBeCalledWith(mockConfigPath, '');
      expect(result).toEqual(mockConsole);
    });
    it('logs and re-throws errors', async () => {
      const mockConfigPath = './mock.yml';
      const mockConsole = await ConsoleParser.fromJson(mockConsoleJson);
      const mockError = new Error();
      process.env.CONFIG_PATH = mockConfigPath;
      mockWriteFileSync.mockImplementationOnce(() => { throw mockError; });
      jest.spyOn(LocalConsoleClient.prototype, 'getConsole').mockResolvedValueOnce(mockConsole);
      jest.spyOn(global.console, 'error').mockImplementationOnce(jest.fn());

      let thrownError;
      try {
        await localConsoleClient.deleteConsole('mock-console');
      } catch (error) {
        thrownError = error;
      } finally {
        expect(localConsoleClient.getConsole).toBeCalled();
        expect(mockWriteFileSync).toBeCalled();
        expect(global.console.error).toBeCalled();
        expect(global.console.error).toBeCalledWith('Failed to delete local console mock-console!', mockError);
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(mockError);
      }
    });
  });
});