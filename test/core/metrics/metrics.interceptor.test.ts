import { MetricsInterceptor } from 'src/core/metrics/metrics.interceptor';
import { of } from 'rxjs';

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
});
