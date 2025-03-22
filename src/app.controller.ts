import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrentUserContext } from './decorators/current.user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Initiates the kickoff process using the current user's context.
   *
   * @param user - The current user's context, typically injected via the `@CurrentUserContext()` decorator.
   * @returns The result of the kickoff process, as handled by the `appService.kickoff` method.
   */
  @Get()
  kickoff(@CurrentUserContext() user: any) {
    return this.appService.kickoff(user);
  }
}
