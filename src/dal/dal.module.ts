import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cluster } from 'src/models/cluster.model';
import { Performance } from 'src/models/performance.model';
import { Junction } from 'src/models/junction.model';
import { Platform } from 'src/models/platform.model';
import { Project } from 'src/models/project.model';
import { Provider } from 'src/models/provider.model';
import { Url } from 'src/models/url.model';
import { BackupService } from './backup/backup.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Cluster,
      Performance,
      Junction,
      Platform,
      Project,
      Provider,
      Url,
    ]),
  ],
  exports: [SequelizeModule],
  providers: [BackupService],
})
export class DalModule {}
