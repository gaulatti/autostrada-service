import { Module } from '@nestjs/common';
import { DalModule } from 'src/dal/dal.module';
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
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'wiphala',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'wiphala',
            protoPath: join(__dirname, '../proto/wiphala.proto'),
            url: configService.get<string>('WIPHALA_GRPC_URL'),
            loader: {
              keepCase: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    DalModule,
  ],
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
})
export class ScansModule {}
