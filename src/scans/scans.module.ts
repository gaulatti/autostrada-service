import { Module } from '@nestjs/common';
import { HeartbeatsController } from './heartbeats/heartbeats.controller';
import { HeartbeatsService } from './heartbeats/heartbeats.service';
import { PulsesController } from './pulses/pulses.controller';
import { PulsesService } from './pulses/pulses.service';
import { PlatformService } from './platform/platform.service';
import { ProviderController } from './provider/provider.controller';
import { ProviderService } from './provider/provider.service';
import { ProjectController } from './project/project.controller';
import { ProjectService } from './project/project.service';
import { PlatformController } from './platform/platform.controller';
import { PlatformController } from './platform/platform.controller';
import { ProjectController } from './project/project.controller';
import { ProviderService } from './provider/provider.service';
import { ProviderController } from './provider/provider.controller';
import { PlatformService } from './platform/platform.service';

@Module({
  providers: [PulsesService, HeartbeatsService, PlatformService, ProviderService, ProjectService],
  controllers: [HeartbeatsController, PulsesController, PlatformController, ProjectController, ProviderController],
})
export class ScansModule {}
