import { Module } from '@nestjs/common';
import { DalModule } from 'src/dal/dal.module';
import { CwvController } from './cwv/cwv.controller';
import { CwvService } from './cwv/cwv.service';
import { GradesController } from './grades/grades.controller';
import { GradesService } from './grades/grades.service';

@Module({
  imports: [DalModule],
  providers: [GradesService, CwvService],
  controllers: [GradesController, CwvController],
  exports: [GradesService, CwvService],
})
export class MetricsModule {}
