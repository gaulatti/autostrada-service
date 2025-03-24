import { Module } from '@nestjs/common';
import { ClustersController } from './clusters/clusters.controller';
import { ClustersService } from './clusters/clusters.service';
import { JunctionController } from './junction/junction.controller';
import { JunctionService } from './junction/junction.service';
import { UrlsController } from './urls/urls.controller';
import { UrlsService } from './urls/urls.service';
import { DalModule } from 'src/dal/dal.module';

@Module({
  imports: [DalModule],
  providers: [ClustersService, UrlsService, JunctionService],
  controllers: [UrlsController, ClustersController, JunctionController],
})
export class TargetsModule {}
