const mockGetConsoles = jest.fn();
const mockSaveConsole = jest.fn();
const mockDeleteConsole = jest.fn();

jest.mock('../../src/clients/console-client.js', () => jest.fn().mockImplementation(() => ({
  getConsoles: mockGetConsoles,
  saveConsole: mockSaveConsole,
  deleteConsole: mockDeleteConsole
})));

import { Console } from '@tinystacks/ops-model';
import ConsoleController from '../../src/controllers/console-controller.js';
const requestBody: Console = {
  name: 'mock-console',
  dashboards: {},
  providers: {},
  widgets: {},
  dependencies: {}
};
describe('console controller tests', () => {
  it('getConsole', async () => {
    mockGetConsoles.mockResolvedValueOnce([]);
    await ConsoleController.getConsoles();
    expect(mockGetConsoles).toBeCalled();
  });
  it('postConsole', async () => {
    mockSaveConsole.mockResolvedValueOnce({ toJson: () => {} });
    await ConsoleController.postConsole(requestBody);
    expect(mockSaveConsole).toBeCalled();
    expect(mockSaveConsole).toBeCalledWith(requestBody.name, requestBody);
  });
  it('putConsole', async () => {
    mockSaveConsole.mockResolvedValueOnce({ toJson: () => {} });
    await ConsoleController.putConsole('mock-console', {
      ...requestBody,
      name: 'mock-console-2'
    });
    expect(mockSaveConsole).toBeCalled();
    expect(mockSaveConsole).toBeCalledWith('mock-console', {
      ...requestBody,
      name: 'mock-console-2'
    });
  });
  it('deleteConsole', async () => {
    mockDeleteConsole.mockResolvedValueOnce({ toJson: () => {} });
    await ConsoleController.deleteConsole('mock-console');
    expect(mockDeleteConsole).toBeCalled();
    expect(mockDeleteConsole).toBeCalledWith('mock-console');
  });
});