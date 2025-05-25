import { forwardRef, Module } from '@nestjs/common';
import { DalModule } from 'src/dal/dal.module';
import { ScansModule } from 'src/scans/scans.module';
import { TargetsModule } from 'src/targets/targets.module';
import { PerformanceController } from './performance/performance.controller';
import { PerformanceService } from './performance/performance.service';

@Module({
  imports: [DalModule, ScansModule, forwardRef(() => TargetsModule)],
  providers: [PerformanceService],
  controllers: [PerformanceController],
  exports: [PerformanceService],
})
export class MetricsModule {}
