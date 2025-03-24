import { Module } from '@nestjs/common';
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
import { DalModule } from 'src/dal/dal.module';

@Module({
  imports: [DalModule],
  providers: [
    PulsesService,
    HeartbeatsService,
    PlatformService,
    ProviderService,
    ProjectService,
  ],
  controllers: [
    HeartbeatsController,
    PulsesController,
    PlatformController,
    ProjectController,
    ProviderController,
  ],
})
export class ScansModule {}
