import { MetricsInterceptor } from 'src/core/metrics/metrics.interceptor';
import { of, throwError } from 'rxjs';

describe('MetricsInterceptor', () => {
  it('should be defined', () => {
    const cloudWatchService = { sendMetric: jest.fn() } as any;
    const reflector = { get: jest.fn() } as any;
    expect(new MetricsInterceptor(cloudWatchService, reflector)).toBeDefined();
  });

  it('should call sendCountMetric and sendLatencyMetric on success', () => {
    const cloudWatchService = { sendMetric: jest.fn() } as any;
    const reflector = { get: jest.fn() } as any;
    const interceptor = new MetricsInterceptor(cloudWatchService, reflector);
    (interceptor as any)['sendCountMetric'] = jest.fn();
    (interceptor as any)['sendLatencyMetric'] = jest.fn();
    const context: any = {
      getClass: () => ({ name: 'TestController' }),
      getHandler: () => ({}),
      switchToHttp: () => ({ getRequest: () => ({ method: 'GET' }) }),
    };
    const next = {
      handle: () => of({}),
    };
    (interceptor as any).intercept(context, next as any).subscribe({
      complete: () => {
        expect((interceptor as any)['sendCountMetric']).toHaveBeenCalled();
        expect((interceptor as any)['sendLatencyMetric']).toHaveBeenCalled();
      },
    });
  });

  it('should call sendCountMetric, sendLatencyMetric, and sendMetric on error', async () => {
    const cloudWatchService = { sendMetric: jest.fn() } as any;
    const reflector = { get: jest.fn() } as any;
    const interceptor = new MetricsInterceptor(cloudWatchService, reflector);
    (interceptor as any)['sendCountMetric'] = jest.fn();
    (interceptor as any)['sendLatencyMetric'] = jest.fn();
    const context: any = {
      getClass: () => ({ name: 'TestController' }),
      getHandler: () => ({}),
      switchToHttp: () => ({ getRequest: () => ({ method: 'POST' }) }),
    };
    const error = { status: 400 };
    const next = {
      handle: () => throwError(() => error),
    };
    await expect(
      (interceptor as any).intercept(context, next as any).toPromise(),
    ).rejects.toBe(error);
    expect((interceptor as any)['sendCountMetric']).toHaveBeenCalled();
    expect((interceptor as any)['sendLatencyMetric']).toHaveBeenCalled();
    expect(cloudWatchService.sendMetric).toHaveBeenCalledWith(
      'StatusCode-400',
      1,
      expect.objectContaining({ Controller: 'TestController' }),
    );
  });
});
