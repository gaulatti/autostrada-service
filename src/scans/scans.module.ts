import { forwardRef, Module } from '@nestjs/common';
import { DalModule } from 'src/dal/dal.module';
import { TargetsModule } from 'src/targets/targets.module';
import { PlatformController } from './platform/platform.controller';
import { PlatformService } from './platform/platform.service';
import { ProjectController } from './project/project.controller';
import { ProjectService } from './project/project.service';
import { ProviderController } from './provider/provider.controller';
import { ProviderService } from './provider/provider.service';
import { SchedulesService } from './schedules/schedules.service';

@Module({
  imports: [DalModule, forwardRef(() => TargetsModule)],
  providers: [
    PlatformService,
    ProviderService,
    ProjectService,
    SchedulesService,
  ],
  controllers: [PlatformController, ProjectController, ProviderController],
  exports: [PlatformService, ProviderService],
})
export class ScansModule {}
