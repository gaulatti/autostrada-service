import { PerformanceService } from 'src/metrics/performance/performance.service';

describe('PerformanceService', () => {
  let service: PerformanceService;
  let performanceModel: any;
  let platformsService: any;
  let providerService: any;
  let urlsService: any;

  beforeEach(() => {
    performanceModel = {
      findAndCountAll: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
    };
    platformsService = { getBySlug: jest.fn() };
    providerService = { getBySlug: jest.fn() };
    urlsService = { get: jest.fn() };
    service = new PerformanceService(
      performanceModel,
      platformsService,
      providerService,
      urlsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('list should call findAndCountAll with correct params', async () => {
    performanceModel.findAndCountAll.mockResolvedValue({ count: 1, rows: [] });
    const result = await service.list(2, 10, 'createdAt', 'desc');
    expect(performanceModel.findAndCountAll).toHaveBeenCalledWith({
      include: [],
      distinct: true,
      offset: 10,
      limit: 10,
      order: [['createdAt', 'desc']],
    });
    expect(result).toEqual({ count: 1, rows: [] });
  });

  it('createPerformanceRecord should create a record with resolved IDs', async () => {
    urlsService.get.mockResolvedValue({ id: 1 });
    platformsService.getBySlug.mockResolvedValue({ id: 2 });
    providerService.getBySlug.mockResolvedValue({ id: 3 });
    performanceModel.create.mockResolvedValue({ id: 42 });
    const metrics = { ttfb: 100, fcp: 200, cls: '0.01' };
    const result = await service.createPerformanceRecord(
      'url',
      'plat',
      'prov',
      new Date('2025-01-01'),
      metrics,
    );
    expect(urlsService.get).toHaveBeenCalledWith('url');
    expect(platformsService.getBySlug).toHaveBeenCalledWith('plat');
    expect(providerService.getBySlug).toHaveBeenCalledWith('prov');
    expect(performanceModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        url_id: 1,
        platforms_id: 2,
        provider_id: 3,
        ttfb: 100,
        fcp: 200,
        cls: '0.01',
      }),
    );
    expect(result).toEqual({ id: 42 });
  });

  it('createPerformanceRecord should throw if url not found', async () => {
    urlsService.get.mockResolvedValue(undefined);
    await expect(
      service.createPerformanceRecord('url', 'plat', 'prov', new Date(), {}),
    ).rejects.toThrow('URL with slug url not found');
  });

  it('createPerformanceRecord should throw if platform not found', async () => {
    urlsService.get.mockResolvedValue({ id: 1 });
    platformsService.getBySlug.mockResolvedValue(undefined);
    await expect(
      service.createPerformanceRecord('url', 'plat', 'prov', new Date(), {}),
    ).rejects.toThrow('Platform with slug plat not found');
  });

  it('createPerformanceRecord should throw if provider not found', async () => {
    urlsService.get.mockResolvedValue({ id: 1 });
    platformsService.getBySlug.mockResolvedValue({ id: 2 });
    providerService.getBySlug.mockResolvedValue(undefined);
    await expect(
      service.createPerformanceRecord('url', 'plat', 'prov', new Date(), {}),
    ).rejects.toThrow('Provider with slug prov not found');
  });

  it('getDataPoints should call findAll and map results', async () => {
    performanceModel.findAll.mockResolvedValue([
      {
        createdAt: new Date('2025-01-01'),
        platform: { slug: 'plat' },
        provider: { slug: 'prov' },
        ttfb: 1,
        fcp: 2,
        dcl: 3,
        lcp: 4,
        tti: 5,
        si: 6,
        cls: '0.01',
        tbt: 7,
      },
    ]);
    const result = await service.getDataPoints(
      1,
      new Date('2025-01-01'),
      new Date('2025-01-02'),
    );
    expect(performanceModel.findAll).toHaveBeenCalled();
    expect(result[0]).toMatchObject({
      platform_slug: 'plat',
      provider_slug: 'prov',
      ttfb: 1,
    });
  });
});
