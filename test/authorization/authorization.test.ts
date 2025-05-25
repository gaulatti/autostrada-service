import { AuthorizationGuard } from 'src/authorization/authorization.guard';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { AuthorizationStrategy } from 'src/authorization/authorization.strategy';
import { AuthorizationModule } from 'src/authorization/authorization.module';

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
});
