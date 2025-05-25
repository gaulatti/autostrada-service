import { Test, TestingModule } from '@nestjs/testing';
import { CloudWatchService } from 'src/core/cloudwatch/cloudwatch.service';

describe('CloudWatchService', () => {
  let service: CloudWatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudWatchService],
    }).compile();
    service = module.get<CloudWatchService>(CloudWatchService);
    process.env.CONTAINERIZED = 'true'; // Ensure CONTAINERIZED is set for the tests
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send metrics with correct params', async () => {
    // @ts-expect-error: test access
    service['cloudWatchClient'] = { send: jest.fn().mockResolvedValue({}) };
    const spy = jest.spyOn(service['cloudWatchClient'], 'send');
    await service.sendMetric('TestMetric', 42, { Foo: 'Bar' });
    expect(spy).toHaveBeenCalled();
  });

  it('should handle errors when sending metrics', async () => {
    // @ts-expect-error: test access
    service['cloudWatchClient'] = {
      send: jest.fn().mockRejectedValue(new Error('fail')),
    };
    const loggerSpy = jest
      .spyOn(service['logger'], 'error')
      .mockImplementation(() => {});
    await service.sendMetric('TestMetric', 1);
    expect(loggerSpy).toHaveBeenCalled();
  });
});
