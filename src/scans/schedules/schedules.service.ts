import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SchedulesService {
  @Cron(`* * * * *`)
  testSchedule() {
    // console.log('test');
  }
}
