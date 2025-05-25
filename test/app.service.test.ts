import { AppService } from 'src/app.service';

describe('AppService', () => {
  it('should be defined', () => {
    // Provide a mock for AuthorizationService
    const mockAuthService = {};
    expect(new AppService(mockAuthService as any)).toBeDefined();
  });

  // Add more tests for service methods if needed
});
