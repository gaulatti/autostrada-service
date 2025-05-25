import { CurrentUserContext } from 'src/decorators/current.user.decorator';
import { Logger } from 'src/decorators/logger.decorator';
import { Public } from 'src/decorators/public.decorator';

describe('Decorators', () => {
  it('CurrentUserContext should be defined', () => {
    expect(CurrentUserContext).toBeDefined();
  });
  it('Logger should be defined', () => {
    expect(Logger).toBeDefined();
  });
  it('Public should be defined', () => {
    expect(Public).toBeDefined();
  });
});
