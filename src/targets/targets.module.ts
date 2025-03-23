import { Module } from '@nestjs/common';
import { ClustersController } from './clusters/clusters.controller';
import { ClustersService } from './clusters/clusters.service';
import { UrlsController } from './urls/urls.controller';
import { UrlsService } from './urls/urls.service';

@Module({
  providers: [ClustersService, UrlsService],
  controllers: [UrlsController, ClustersController],
})
export class TargetsModule {}
