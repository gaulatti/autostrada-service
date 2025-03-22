import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  GetFeaturesByApplicationResponse,
  PompeiiService,
} from '../interfaces/pompeii.interface';

@Injectable()
export class AuthorizationService implements OnModuleInit {
  private pompeiiService: PompeiiService;

  constructor(@Inject('pompeii') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.pompeiiService =
      this.client.getService<PompeiiService>('PompeiiService');
  }

  async getFeatures(): Promise<GetFeaturesByApplicationResponse> {
    return firstValueFrom(
      this.pompeiiService.getFeaturesByApplication({
        slug: process.env.POMPEII_KEY!,
      }),
    );
  }
}
