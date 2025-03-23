import { Module } from '@nestjs/common';
import { PulsesService } from './pulses/pulses.service';
import { HeartbeatsService } from './heartbeats/heartbeats.service';
import { GradesService } from './grades/grades.service';
import { GradesController } from './grades/grades.controller';
import { HeartbeatsController } from './heartbeats/heartbeats.controller';
import { PulsesController } from './pulses/pulses.controller';

@Module({
  providers: [PulsesService, HeartbeatsService, GradesService],
  controllers: [GradesController, HeartbeatsController, PulsesController]
})
export class ScansModule {}
