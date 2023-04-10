export class MockCache {
  cacheName?: string;
  options?: Record<string, any>;
  get: jest.Mock;
  set: jest.Mock;
  getOrElse: jest.Mock;
  refreshFunction: (...args: any[]) => Promise<any>;

  constructor (cacheName?: string, options?: Record<string, any>) {
    this.cacheName = cacheName;
    this.options = options;
    this.get = jest.fn();
    this.set = jest.fn();
    this.getOrElse = jest.fn().mockImplementation((key: string, refreshFunction: (...args: any[]) => Promise<any>) => {
      this.refreshFunction = refreshFunction;
    });
  }

  reset () {
    this.get.mockReset();
    this.set.mockReset();
    this.getOrElse.mockReset();
  }

  restore () {
    this.get.mockRestore();
    this.set.mockRestore();
    this.getOrElse.mockRestore();
  }
}

export function mockCache (cacheName: string, options: Record<string, any>): MockCache {
  return new MockCache(cacheName, options);
}