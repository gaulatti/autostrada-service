import { Module } from '@nestjs/common';
import { HeartbeatsController } from './heartbeats/heartbeats.controller';
import { HeartbeatsService } from './heartbeats/heartbeats.service';
import { PulsesController } from './pulses/pulses.controller';
import { PulsesService } from './pulses/pulses.service';

@Module({
  providers: [PulsesService, HeartbeatsService],
  controllers: [HeartbeatsController, PulsesController],
})
export class ScansModule {}
