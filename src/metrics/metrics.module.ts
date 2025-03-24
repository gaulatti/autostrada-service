import { Module } from '@nestjs/common';
import { GradesController } from './grades/grades.controller';
import { GradesService } from './grades/grades.service';
import { CwvService } from './cwv/cwv.service';
import { CwvController } from './cwv/cwv.controller';
import { DalModule } from 'src/dal/dal.module';

@Module({
  imports: [DalModule],
  providers: [GradesService, CwvService],
  controllers: [GradesController, CwvController],
})
export class MetricsModule {}
