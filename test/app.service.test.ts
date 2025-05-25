import { AppService } from 'src/app.service';

describe('AppService', () => {
  it('should be defined', () => {
    // Provide a mock for AuthorizationService
    const mockAuthService = {};
    expect(new AppService(mockAuthService as any)).toBeDefined();
  });

  it('should return user with enums if user is provided', async () => {
    const mockAuthService = { getFeatures: jest.fn() };
    const service = new AppService(mockAuthService as any);
    const user = { id: 1, name: 'Test User' };
    const result = await service.kickoff(user);
    expect(result).toEqual({ id: 1, name: 'Test User', enums: [] });
    expect(mockAuthService.getFeatures).not.toHaveBeenCalled();
  });

  it('should call getFeatures if user is not provided', async () => {
    const features = { id: 2, name: 'From Features' };
    const mockAuthService = {
      getFeatures: jest.fn().mockResolvedValue(features),
    };
    const service = new AppService(mockAuthService as any);
    const result = await service.kickoff(undefined);
    expect(mockAuthService.getFeatures).toHaveBeenCalled();
    expect(result).toEqual({ id: 2, name: 'From Features', enums: [] });
  });
});
