import { Injectable } from '@nestjs/common';
import { AuthorizationService } from './authorization/authorization.service';

@Injectable()
export class AppService {
  constructor(private readonly authorizationService: AuthorizationService) {}

  async kickoff() {
    const { features } = await this.authorizationService.getFeatures();
    return {
      features,
      enums: [],
      me: {
        memberships: [],
      },
    };
  }
}
