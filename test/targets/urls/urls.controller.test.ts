import { UrlsController } from 'src/targets/urls/urls.controller';

describe('UrlsController', () => {
  it('should be defined', () => {
    const mockService = { list: jest.fn(), getByFQDN: jest.fn() };
    const mockPerf = { list: jest.fn() };
    const controller = new UrlsController(mockService as any, mockPerf as any);
    expect(controller).toBeDefined();
  });

  it('should call service.list with correct params', () => {
    const mockService = { list: jest.fn(), getByFQDN: jest.fn() };
    const mockPerf = { list: jest.fn() };
    const controller = new UrlsController(mockService as any, mockPerf as any);
    controller.list(1, 10, 'id', 'asc');
    expect(mockService.list).toHaveBeenCalledWith(1, 10, 'id', 'asc');
  });
});
