import { AuthorizationService } from 'src/authorization/authorization.service';
import { PompeiiService } from 'src/interfaces/pompeii.interface';

describe('AuthorizationService', () => {
  let service: AuthorizationService;
  let mockClient: any;
  let mockPompeiiService: any;
  const OLD_ENV = process.env;

  beforeEach(() => {
    mockPompeiiService = {
      getFeaturesByApplication: jest.fn(),
      login: jest.fn(),
    };
    mockClient = {
      getService: jest.fn().mockReturnValue(mockPompeiiService),
    };
    service = new AuthorizationService(mockClient);
    process.env = { ...OLD_ENV, POMPEII_KEY: 'test-key' };
    service.onModuleInit();
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('should call getFeaturesByApplication with correct slug', async () => {
    const expected = { features: ['a', 'b'] };
    mockPompeiiService.getFeaturesByApplication.mockReturnValue({
      toPromise: () => Promise.resolve(expected),
      subscribe: (cb: any) => cb(expected),
    });
    // Patch firstValueFrom to just call subscribe
    jest.spyOn(require('rxjs'), 'firstValueFrom').mockImplementation((obs: any) => Promise.resolve(expected));
    const result = await service.getFeatures();
    expect(mockPompeiiService.getFeaturesByApplication).toHaveBeenCalledWith({ slug: 'test-key' });
    expect(result).toEqual(expected);
  });

  it('should propagate errors from getFeaturesByApplication', async () => {
    mockPompeiiService.getFeaturesByApplication.mockReturnValue({
      toPromise: () => Promise.reject(new Error('fail')),
      subscribe: (cb: any, err: any) => err(new Error('fail')),
    });
    jest.spyOn(require('rxjs'), 'firstValueFrom').mockImplementation(() => Promise.reject(new Error('fail')));
    await expect(service.getFeatures()).rejects.toThrow('fail');
  });

  it('should call login with correct payload and key', async () => {
    const payload = { user: 'bob' };
    const expected = { user: 'bob', context: true };
    mockPompeiiService.login.mockReturnValue({
      toPromise: () => Promise.resolve(expected),
      subscribe: (cb: any) => cb(expected),
    });
    jest.spyOn(require('rxjs'), 'firstValueFrom').mockImplementation((obs: any) => Promise.resolve(expected));
    const result = await service.login(payload as any);
    expect(mockPompeiiService.login).toHaveBeenCalledWith({ ...payload, key: 'test-key' });
    expect(result).toEqual(expected);
  });

  it('should propagate errors from login', async () => {
    mockPompeiiService.login.mockReturnValue({
      toPromise: () => Promise.reject(new Error('fail')),
      subscribe: (cb: any, err: any) => err(new Error('fail')),
    });
    jest.spyOn(require('rxjs'), 'firstValueFrom').mockImplementation(() => Promise.reject(new Error('fail')));
    await expect(service.login({} as any)).rejects.toThrow('fail');
  });
});
