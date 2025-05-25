import { ProviderController } from 'src/scans/provider/provider.controller';

describe('ProviderController', () => {
  it('should be defined', () => {
    const mockService = { list: jest.fn() };
    const controller = new ProviderController(mockService as any);
    expect(controller).toBeDefined();
  });

  it('should call service.list with correct params', () => {
    const mockService = { list: jest.fn() };
    const controller = new ProviderController(mockService as any);
    controller.list(1, 10, 'id', 'asc');
    expect(mockService.list).toHaveBeenCalledWith(1, 10, 'id', 'asc');
  });
});
