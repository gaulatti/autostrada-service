import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { Logger } from 'src/decorators/logger.decorator';
import { JSONLogger } from 'src/utils/logger';
import { nanoid } from 'src/utils/nanoid';
/**
 * As Carlo Conti said: Randomizzatto.
 * This is temporary.
 */
const targets = [
  'https://cadenaser.com',
  'https://elpais.com/?ed=es',
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
  constructor() {}

  /**
   * Temporary until cluster schedules are implemented.
   */
  counter = 0;

  @Cron(`*/30 * * * *`)
  testSchedule() {
    void axios.post(
      process.env.N8N_WEBHOOK!,
      {
        url: targets[this.counter],
        slug: nanoid(),
      },
      {
        headers: {
          'x-api-key': process.env.N8N_API_KEY,
        },
      },
    );

    /**
     * Hack the planet!
     * https://www.youtube.com/watch?v=5T_CqqjOPDc
     */
    this.counter++;
    if (this.counter == targets.length) {
      this.counter = 0;
    }
  }
}
