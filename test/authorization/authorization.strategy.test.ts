import { AuthorizationStrategy } from 'src/authorization/authorization.strategy';
import { ConfigService } from '@nestjs/config';

describe('AuthorizationStrategy', () => {
  it('should construct with correct options', () => {
    const configService = {
      get: jest.fn((key: string) => {
        if (key === 'AWS_REGION') return 'us-east-1';
        if (key === 'COGNITO_USER_POOL_ID') return 'pool123';
        return undefined;
      }),
    } as any;
    const authorizationService = { login: jest.fn() } as any;
    const strategy = new AuthorizationStrategy(configService, authorizationService);
    expect(strategy).toBeDefined();
  });

  it('should call authorizationService.login in validate', async () => {
    const configService = {
      get: jest.fn().mockReturnValue('dummy'),
    } as any;
    const authorizationService = {
      login: jest.fn().mockResolvedValue({ user: 'bob' }),
    } as any;
    const strategy = new AuthorizationStrategy(configService, authorizationService);
    const payload = { user: 'bob' };
    const result = await strategy.validate(payload as any);
    expect(authorizationService.login).toHaveBeenCalledWith(payload);
    expect(result).toEqual({ user: 'bob' });
  });

  it('should propagate errors from authorizationService.login', async () => {
    const configService = {
      get: jest.fn().mockReturnValue('dummy'),
    } as any;
    const authorizationService = {
      login: jest.fn().mockRejectedValue(new Error('fail')),
    } as any;
    const strategy = new AuthorizationStrategy(configService, authorizationService);
    await expect(strategy.validate({} as any)).rejects.toThrow('fail');
  });

  it('sanity check', () => {
    expect(true).toBe(true);
  });
});
