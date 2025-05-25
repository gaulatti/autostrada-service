import { ClustersController } from 'src/targets/clusters/clusters.controller';

describe('ClustersController', () => {
  it('should be defined', () => {
    const mockService = { list: jest.fn(), get: jest.fn() };
    const controller = new ClustersController(mockService as any);
    expect(controller).toBeDefined();
  });

  it('should call service.list with correct params', () => {
    const mockService = { list: jest.fn(), get: jest.fn() };
    const controller = new ClustersController(mockService as any);
    controller.list(1, 10, 'id', 'asc');
    expect(mockService.list).toHaveBeenCalledWith(1, 10, 'id', 'asc');
  });
});
