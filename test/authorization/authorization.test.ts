import { AuthorizationGuard } from 'src/authorization/authorization.guard';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { AuthorizationStrategy } from 'src/authorization/authorization.strategy';
import { AuthorizationModule } from 'src/authorization/authorization.module';
import { ExecutionContext } from '@nestjs/common';

describe('Authorization', () => {
  it('AuthorizationGuard should be defined', () => {
    expect(AuthorizationGuard).toBeDefined();
  });
  it('AuthorizationService should be defined', () => {
    expect(AuthorizationService).toBeDefined();
  });
  it('AuthorizationStrategy should be defined', () => {
    expect(AuthorizationStrategy).toBeDefined();
  });
  it('AuthorizationModule should be defined', () => {
    expect(AuthorizationModule).toBeDefined();
  });

  describe('AuthorizationGuard', () => {
    it('should check for public route if no authorization header', () => {
      const reflector = {
        getAllAndOverride: jest.fn().mockReturnValue(true),
      } as any;
      const guard = new AuthorizationGuard(reflector);
      const context = {
        switchToHttp: () => ({ getRequest: () => ({ headers: {} }) }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;
      expect(guard.canActivate(context)).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });
  });
});
