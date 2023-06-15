const mockS3Client = jest.fn();
const mockLocalClient = jest.fn();
const mockGetConsole = jest.fn();
const mockGetConsoles = jest.fn();
const mockSaveConsole = jest.fn();
const mockDeleteConsole = jest.fn();

jest.mock('../../../src/clients/console-client/s3.js', () => ({
  S3ConsoleClient: mockS3Client
}));
jest.mock('../../../src/clients/console-client/local.js', () => ({
  LocalConsoleClient: mockLocalClient
}));

import { Console } from '@tinystacks/ops-core';
import ConsoleClient from '../../../src/clients/console-client/index.js';

async function getMockConsole () {
  return await Console.fromJson({
    name: 'mock-console',
    dashboards: {},
    providers: {},
    widgets: {},
    dependencies: {}
  });
}

const mockClient = {
  getConsole: mockGetConsole,
  getConsoles: mockGetConsoles,
  saveConsole: mockSaveConsole,
  deleteConsole: mockDeleteConsole
};

describe('console client tests', () => {
  beforeEach(() => {
    mockLocalClient.mockReturnValue(mockClient);
    mockS3Client.mockReturnValue(mockClient);
    process.env.CONFIG_PATH = './config.yml';
  });
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });
  describe('constructor', () => {
    it('uses S3 client if configPath is an s3 uri', () => {
      process.env.CONFIG_PATH = 's3://test-config-bucket/mock-user/index.yml';

      new ConsoleClient();

      expect(mockS3Client).toBeCalled();
      expect(mockLocalClient).not.toBeCalled();
    });
    it('uses local client otherwise', () => {
      new ConsoleClient();

      expect(mockLocalClient).toBeCalled();
      expect(mockS3Client).not.toBeCalled();
    });
  });
  it('getConsole', async () => {
    const mockConsole = await getMockConsole();
    mockGetConsole.mockResolvedValueOnce(mockConsole);
    const result = await new ConsoleClient().getConsole('mock-console');
    expect(mockGetConsole).toBeCalled();
    expect(mockGetConsole).toBeCalledWith('mock-console');
    expect(result).toEqual(mockConsole);
  });
  describe('getConsoles', () => {
    it('returns array of console', async () => {
      const mockConsole = await getMockConsole();
      mockGetConsoles.mockResolvedValueOnce([mockConsole]);

      const result = await new ConsoleClient().getConsoles();
      expect(mockGetConsoles).toBeCalled();
      expect(mockGetConsoles).toBeCalledWith();
      expect(result).toEqual([mockConsole]);
    });
    it('returns empty array if console is empty', async () => {
      mockGetConsoles.mockResolvedValueOnce([]);
      const result = await new ConsoleClient().getConsoles();

      expect(mockGetConsoles).toBeCalled();
      expect(mockGetConsoles).toBeCalledWith();
      expect(result).toEqual([]);
    });
  });
  it('saveConsole', async () => {
    const mockConsole = await getMockConsole();
    await new ConsoleClient().saveConsole('mock-console', mockConsole);

    expect(mockSaveConsole).toBeCalled();
    expect(mockSaveConsole).toBeCalledWith('mock-console', mockConsole);
  });
  it('deleteConsole', async () => {
    await new ConsoleClient().deleteConsole('mock-console');

    expect(mockDeleteConsole).toBeCalled();
    expect(mockDeleteConsole).toBeCalledWith('mock-console');
  });
});