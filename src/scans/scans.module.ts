import { forwardRef, Module } from '@nestjs/common';
import { DalModule } from 'src/dal/dal.module';
import { MetricsModule } from 'src/metrics/metrics.module';
import { TargetsModule } from 'src/targets/targets.module';
import { HeartbeatsController } from './heartbeats/heartbeats.controller';
import { HeartbeatsService } from './heartbeats/heartbeats.service';
import { PlatformController } from './platform/platform.controller';
import { PlatformService } from './platform/platform.service';
import { ProjectController } from './project/project.controller';
import { ProjectService } from './project/project.service';
import { ProviderController } from './provider/provider.controller';
import { ProviderService } from './provider/provider.service';
import { PulsesController } from './pulses/pulses.controller';
import { PulsesService } from './pulses/pulses.service';
import { SchedulesService } from './schedules/schedules.service';

@Module({
  imports: [DalModule, MetricsModule, forwardRef(() => TargetsModule)],
  providers: [
    PulsesService,
    HeartbeatsService,
    PlatformService,
    ProviderService,
    ProjectService,
    SchedulesService,
  ],
  controllers: [
    HeartbeatsController,
    PulsesController,
    PlatformController,
    ProjectController,
    ProviderController,
  ],
  exports: [PulsesService],
})
export class ScansModule {}
