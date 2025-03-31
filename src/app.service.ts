import { Injectable } from '@nestjs/common';
import { AuthorizationService } from './authorization/authorization.service';

@Injectable()
export class AppService {
  constructor(private readonly authorizationService: AuthorizationService) {}

  /**
   * Initiates a process for the given user and returns an object containing the user's data
   * along with an empty `enums` array.
   *
   * @param user - The user object containing relevant data.
   * @returns An object that merges the user's data with an empty `enums` array.
   */
  async kickoff(user: any) {
    const output = user || (await this.authorizationService.getFeatures());

    return {
      ...output,
      enums: [],
    };
  }
}
