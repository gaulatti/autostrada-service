import { JunctionService } from 'src/targets/junction/junction.service';

describe('JunctionService', () => {
  it('should be defined', () => {
    const mockModel = { findAndCountAll: jest.fn() };
    const service = new JunctionService(mockModel as any);
    expect(service).toBeDefined();
  });

  it('should call findAndCountAll with correct params', async () => {
    const mockModel = { findAndCountAll: jest.fn().mockResolvedValue({ count: 1, rows: [] }) };
    const service = new JunctionService(mockModel as any);
    await service.list(2, 5, 'id', 'desc');
    expect(mockModel.findAndCountAll).toHaveBeenCalledWith({
      include: [],
      distinct: true,
      offset: 5,
      limit: 5,
      order: [['id', 'desc']],
    });
  });
});
