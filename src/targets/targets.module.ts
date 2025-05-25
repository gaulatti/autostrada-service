import { forwardRef, Module } from '@nestjs/common';
import { DalModule } from 'src/dal/dal.module';
import { MetricsModule } from 'src/metrics/metrics.module';
import { ScansModule } from 'src/scans/scans.module';
import { ClustersController } from './clusters/clusters.controller';
import { ClustersService } from './clusters/clusters.service';
import { JunctionController } from './junction/junction.controller';
import { JunctionService } from './junction/junction.service';
import { UrlsController } from './urls/urls.controller';
import { UrlsService } from './urls/urls.service';

@Module({
  imports: [
    DalModule,
    forwardRef(() => ScansModule),
    forwardRef(() => MetricsModule),
  ],
  providers: [ClustersService, UrlsService, JunctionService],
  controllers: [UrlsController, ClustersController, JunctionController],
  exports: [ClustersService, UrlsService, JunctionService],
})
export class TargetsModule {}
