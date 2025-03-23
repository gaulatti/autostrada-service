import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cluster } from 'src/models/cluster.model';
import { CoreWebVitals } from 'src/models/core.web.vitals.model';
import { Grade } from 'src/models/grade.model';
import { Heartbeat } from 'src/models/heartbeat.model';
import { Junction } from 'src/models/junction.model';
import { Platform } from 'src/models/platform.model';
import { Project } from 'src/models/project.model';
import { Provider } from 'src/models/provider.model';
import { Pulse } from 'src/models/pulse.model';
import { Url } from 'src/models/url.model';
import { BackupService } from './backup/backup.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Cluster,
      CoreWebVitals,
      Grade,
      Heartbeat,
      Junction,
      Platform,
      Project,
      Provider,
      Pulse,
      Url,
    ]),
  ],
  exports: [SequelizeModule],
  providers: [BackupService],
})
export class DalModule {}
