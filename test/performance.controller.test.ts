import { Test, TestingModule } from '@nestjs/testing';
import { PerformanceController } from 'src/metrics/performance/performance.controller';
import { PerformanceService } from 'src/metrics/performance/performance.service';

describe('PerformanceController', () => {
  let controller: PerformanceController;
  let service: any;

  beforeEach(async () => {
    service = {
      list: jest.fn(),
      createPerformanceRecord: jest.fn(),
      getStats: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerformanceController],
      providers: [
        { provide: PerformanceService, useValue: service },
      ],
    }).compile();
    controller = module.get<PerformanceController>(PerformanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.list with query params', () => {
    service.list.mockResolvedValue('result');
    const result = controller.list(1, 10, 'createdAt', 'desc');
    expect(service.list).toHaveBeenCalledWith(1, 10, 'createdAt', 'desc');
    expect(result).resolves.toBe('result');
  });

  it('should call service.createPerformanceRecord and return id', async () => {
    service.createPerformanceRecord.mockResolvedValue({ id: 42 });
    const data = {
      url_slug: 'url',
      platform_slug: 'plat',
      provider_slug: 'prov',
      createdAt: new Date('2025-01-01'),
      metrics: { ttfb: 1 },
    };
    const result = await controller.create(data);
    expect(service.createPerformanceRecord).toHaveBeenCalledWith(
      'url', 'plat', 'prov', data.createdAt, data.metrics
    );
    expect(result).toEqual({ id: 42 });
  });

  it('should log and throw error on create failure', async () => {
    const error = new Error('fail');
    service.createPerformanceRecord.mockRejectedValue(error);
    const data = {
      url_slug: 'url',
      platform_slug: 'plat',
      provider_slug: 'prov',
      createdAt: new Date('2025-01-01'),
      metrics: { ttfb: 1 },
    };
    // Patch logger via Object.defineProperty to bypass private/readonly
    Object.defineProperty(controller, 'logger', {
      value: { error: jest.fn() },
    });
    await expect(controller.create(data)).rejects.toThrow('fail');
    expect(controller['logger'].error).toHaveBeenCalled();
  });

  it('should call service.getStats with parsed dates and params', async () => {
    service.getStats.mockResolvedValue('stats');
    const result = await controller.getStats(
      '2025-01-01T00:00:00.000Z',
      '2025-01-02T00:00:00.000Z',
      'plat',
      'prov',
    );
    expect(service.getStats).toHaveBeenCalledWith(
      undefined,
      new Date('2025-01-01T00:00:00.000Z'),
      new Date('2025-01-02T00:00:00.000Z'),
      'plat',
      'prov',
    );
    expect(result).toBe('stats');
  });

  it('should throw on invalid from date', async () => {
    await expect(
      controller.getStats('bad', '2025-01-02T00:00:00.000Z'),
    ).rejects.toThrow('Invalid "from" date format. Expected ISO timestamp.');
  });

  it('should throw on invalid to date', async () => {
    await expect(
      controller.getStats('2025-01-01T00:00:00.000Z', 'bad'),
    ).rejects.toThrow('Invalid "to" date format. Expected ISO timestamp.');
  });

  it('should throw if from > to', async () => {
    await expect(
      controller.getStats(
        '2025-01-02T00:00:00.000Z',
        '2025-01-01T00:00:00.000Z',
      ),
    ).rejects.toThrow('"from" date must be before "to" date.');
  });
});
