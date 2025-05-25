import { ClustersService } from 'src/targets/clusters/clusters.service';

describe('ClustersService', () => {
  it('should be defined', () => {
    const mockModel = { findAndCountAll: jest.fn(), findOne: jest.fn() };
    const service = new ClustersService(mockModel as any);
    expect(service).toBeDefined();
  });

  it('should call findAndCountAll with correct params', async () => {
    const mockModel = { findAndCountAll: jest.fn().mockResolvedValue({ count: 1, rows: [] }), findOne: jest.fn() };
    const service = new ClustersService(mockModel as any);
    await service.list(2, 5, 'id', 'desc');
    expect(mockModel.findAndCountAll).toHaveBeenCalledWith({
      include: [],
      distinct: true,
      offset: 5,
      limit: 5,
      order: [['id', 'desc']],
    });
  });

  it('should call findOne with correct slug', async () => {
    const mockModel = {
      findOne: jest.fn().mockResolvedValue({ id: 1 }),
      findAndCountAll: jest.fn(),
    };
    const service = new ClustersService(mockModel as any);
    const result = await service.get('slug-123');
    expect(mockModel.findOne).toHaveBeenCalledWith({
      where: { slug: 'slug-123' },
      include: expect.any(Array),
    });
    expect(result).toEqual({ id: 1 });
  });
});
