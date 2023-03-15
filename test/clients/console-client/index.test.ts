const mockGetLocalConsole = jest.fn();
const mockSaveLocalConsole = jest.fn();
const mockDeleteLocalConsole = jest.fn();

jest.mock('../../../src/clients/console-client/local.ts', () => ({
  getLocalConsole: mockGetLocalConsole,
  saveLocalConsole: mockSaveLocalConsole,
  deleteLocalConsole: mockDeleteLocalConsole
}));

import { ConsoleParser } from '@tinystacks/ops-core';
import ConsoleClient from '../../../src/clients/console-client';

const mockConsole = await ConsoleParser.fromJson({
  name: 'mock-console',
  dashboards: {},
  providers: {},
  widgets: {}
});

describe('console client tests', () => {
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });
  it('getConsole', async () => {
    mockGetLocalConsole.mockResolvedValue(mockConsole);
    const result = await new ConsoleClient().getConsole('mock-console');
    
    expect(mockGetLocalConsole).toBeCalled();
    expect(mockGetLocalConsole).toBeCalledWith();
    expect(result).toEqual(mockConsole);
  });
  describe('getConsoles', () => {
    it('returns array of console', async () => {
      mockGetLocalConsole.mockResolvedValue(mockConsole);
      
      const result = await new ConsoleClient().getConsoles();
      
      expect(mockGetLocalConsole).toBeCalled();
      expect(mockGetLocalConsole).toBeCalledWith();
      expect(result).toEqual([mockConsole]);
    });
    it('returns empty array if console is empty', async () => {
      mockGetLocalConsole.mockResolvedValue(undefined);
      
      const result = await new ConsoleClient().getConsoles();
      
      expect(mockGetLocalConsole).toBeCalled();
      expect(mockGetLocalConsole).toBeCalledWith();
      expect(result).toEqual([]);
    });
  });
  it('saveConsole', async () => {
    await new ConsoleClient().saveConsole('mock-console', mockConsole);
    
    expect(mockSaveLocalConsole).toBeCalled();
    expect(mockSaveLocalConsole).toBeCalledWith(mockConsole);
  });
  it('deleteConsole', async () => {
    await new ConsoleClient().deleteConsole('mock-console');
    
    expect(mockDeleteLocalConsole).toBeCalled();
    expect(mockDeleteLocalConsole).toBeCalledWith('mock-console');
  });
});