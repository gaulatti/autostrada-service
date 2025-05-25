import { UrlsService } from 'src/targets/urls/urls.service';

describe('UrlsService', () => {
  it('should be defined', () => {
    const mockModel = {
      findAndCountAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
    };
    const service = new UrlsService(mockModel as any);
    expect(service).toBeDefined();
  });

  it('should call findAndCountAll with correct params', async () => {
    const mockModel = {
      findAndCountAll: jest.fn().mockResolvedValue({ count: 1, rows: [] }),
      findOne: jest.fn(),
      create: jest.fn(),
    };
    const service = new UrlsService(mockModel as any);
    await service.list(2, 5, 'id', 'desc');
    expect(mockModel.findAndCountAll).toHaveBeenCalledWith({
      include: [],
      distinct: true,
      offset: 5,
      limit: 5,
      order: [['id', 'desc']],
    });
  });

  it('should call findOrBuild with correct url in getByFQDN', async () => {
    const mockInstance = { id: 1, save: jest.fn() };
    const mockModel = {
      findOrBuild: jest.fn().mockResolvedValue([mockInstance, false]),
      create: jest.fn(),
      findAndCountAll: jest.fn(),
    };
    const service = new UrlsService(mockModel as any);
    const result = await service.getByFQDN('https://foo.com');
    expect(mockModel.findOrBuild).toHaveBeenCalledWith({
      where: { url: 'https://foo.com' },
    });
    expect(result).toEqual(mockInstance);
  });
});
