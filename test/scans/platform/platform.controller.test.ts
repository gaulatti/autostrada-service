import { PlatformController } from 'src/scans/platform/platform.controller';

describe('PlatformController', () => {
  it('should be defined', () => {
    const mockService = { list: jest.fn() };
    const controller = new PlatformController(mockService as any);
    expect(controller).toBeDefined();
  });

  it('should call service.list with correct params', () => {
    const mockService = { list: jest.fn() };
    const controller = new PlatformController(mockService as any);
    controller.list(1, 10, 'id', 'asc');
    expect(mockService.list).toHaveBeenCalledWith(1, 10, 'id', 'asc');
  });
});
