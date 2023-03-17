const mockGetLocalConsole = jest.fn();
const mockGetLocalConsoles = jest.fn();
const mockSaveLocalConsole = jest.fn();
const mockDeleteLocalConsole = jest.fn();

// const mockLocalClient = jest.fn();
// mockLocalClient.mockImplementation(() => ({
//   getConsole: mockGetLocalConsole,
//   getConsoles: mockGetLocalConsoles,
//   saveConsole: mockSaveLocalConsole,
//   deleteConsole: mockDeleteLocalConsole
// }));
const mockLocalClient = jest.mock('../../../src/clients/console-client/local.js', () => jest.fn().mockImplementation(() => ({
  getConsole: mockGetLocalConsole,
  getConsoles: mockGetLocalConsoles,
  saveConsole: mockSaveLocalConsole,
  deleteConsole: mockDeleteLocalConsole
})));

import { ConsoleParser } from '@tinystacks/ops-core';
import ConsoleClient from '../../../src/clients/console-client/index.js';

async function getMockConsole() {
  return await ConsoleParser.fromJson({
    name: 'mock-console',
    dashboards: {},
    providers: {},
    widgets: {},
    dependencies: {}
  });
}


describe('console client tests', () => {
  it('getConsole', async () => {
    const mockConsole = await getMockConsole();
    mockGetLocalConsole.mockResolvedValueOnce(mockConsole);
    const result = await new ConsoleClient().getConsole('mock-console');
    expect(mockGetLocalConsole).toBeCalled();
    expect(mockGetLocalConsole).toBeCalledWith('mock-console');
    expect(result).toEqual(mockConsole);
  });
  describe('getConsoles', () => {
    it('returns array of console', async () => {
      const mockConsole = await getMockConsole();
      mockGetLocalConsoles.mockResolvedValueOnce([mockConsole]);
      
      const result = await new ConsoleClient().getConsoles();
      expect(mockGetLocalConsoles).toBeCalled();
      expect(mockGetLocalConsoles).toBeCalledWith();
      expect(result).toEqual([mockConsole]);
    });
    it('returns empty array if console is empty', async () => {
      mockGetLocalConsoles.mockResolvedValueOnce([]);
      const result = await new ConsoleClient().getConsoles();
      
      expect(mockGetLocalConsoles).toBeCalled();
      expect(mockGetLocalConsoles).toBeCalledWith();
      expect(result).toEqual([]);
    });
  });
  it('saveConsole', async () => {
    const mockConsole = await getMockConsole();
    await new ConsoleClient().saveConsole('mock-console', mockConsole);
    
    expect(mockSaveLocalConsole).toBeCalled();
    expect(mockSaveLocalConsole).toBeCalledWith('mock-console', mockConsole);
  });
  it('deleteConsole', async () => {
    await new ConsoleClient().deleteConsole('mock-console');
    
    expect(mockDeleteLocalConsole).toBeCalled();
    expect(mockDeleteLocalConsole).toBeCalledWith('mock-console');
  });
});