import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { Logger } from 'src/decorators/logger.decorator';
import { WiphalaService } from 'src/interfaces/wiphala.interface';
import { JSONLogger } from 'src/utils/logger';
import { getGrpcTalkbackEndpoint } from 'src/utils/network';

/**
 * As Carlo Conti said: Randomizzatto.
 * This is temporary.
 */
const targets = [
  'https://elpais.com/?ed=es',
  'https://cadenaser.com',
  'https://www.cooperativa.cl',
  'https://www.biobiochile.cl',
  'https://news.sky.com',
  'https://www.swr3.de',
  'https://www.rbb24.de',
  'https://radiosol.cl',
  'https://soyantofagasta.cl',
  'https://www.rainews.it',
  'https://www.corriere.it',
  'https://www.nytimes.com',
  'https://www.clarin.com',
  'https://www.ole.com.ar/?country=ar',
  'https://www.politico.com',
];

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
   * Temporary until cluster schedules are implemented.
   */
  counter = 0;

  /**
   * Lifecycle hook that is called when the module is initialized.
   * This method retrieves and assigns the WiphalaService instance
   * from the client to the `WiphalaService` property.
   */
  onModuleInit() {
    this.wiphalaService =
      this.client.getService<WiphalaService>('WiphalaService');
  }

  @Cron(`* * * * *`)
  testSchedule() {
    void firstValueFrom(
      this.wiphalaService.trigger({
        slug: process.env.WIPHALA_SLUG!,
        context: JSON.stringify({
          url: targets[this.counter],
        }),
        origin: getGrpcTalkbackEndpoint(),
      }),
    );

    this.counter++;
  }
}
