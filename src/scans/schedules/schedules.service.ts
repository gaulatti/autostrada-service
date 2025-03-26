import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { Logger } from 'src/decorators/logger.decorator';
import { WiphalaService } from 'src/interfaces/wiphala.interface';
import { JSONLogger } from 'src/utils/logger';
import { getGrpcTalkbackEndpoint } from 'src/utils/network';

@Injectable()
export class SchedulesService {
  /**
   * Logger instance for logging messages.
   */
  @Logger(SchedulesService.name)
  private readonly logger!: JSONLogger;

  private wiphalaService: WiphalaService;
  constructor(@Inject('wiphala') private readonly client: ClientGrpc) {}

  /**
   * Lifecycle hook that is called when the module is initialized.
   * This method retrieves and assigns the WiphalaService instance
   * from the client to the `WiphalaService` property.
   */
  onModuleInit() {
    this.wiphalaService =
      this.client.getService<WiphalaService>('WiphalaService');
  }

  @Cron(`*/5 * * * *`)
  async testSchedule() {
    await firstValueFrom(
      this.wiphalaService.trigger({
        slug: process.env.WIPHALA_SLUG!,
        context: JSON.stringify({
          url: 'https://elpais.com',
        }),
        origin: getGrpcTalkbackEndpoint(),
      }),
    );
  }
}
