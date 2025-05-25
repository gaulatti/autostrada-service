import { ProjectService } from 'src/scans/project/project.service';

describe('ProjectService', () => {
  it('should be defined', () => {
    const mockModel = { findAndCountAll: jest.fn() };
    const service = new ProjectService(mockModel as any);
    expect(service).toBeDefined();
  });

  it('should call findAndCountAll with correct params', async () => {
    const mockModel = { findAndCountAll: jest.fn().mockResolvedValue({ count: 1, rows: [] }) };
    const service = new ProjectService(mockModel as any);
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
