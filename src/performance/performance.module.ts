import { Module } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { PerformanceController } from './performance.controller';
import { PerformanceSchedule } from './entities/performanceSchedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Performance } from './entities/performance.entity';

@Module({
  //repository 쓰기 위해 imports
  imports: [
    TypeOrmModule.forFeature([Performance, PerformanceSchedule])
  ],
  providers: [PerformanceService],
  controllers: [PerformanceController]
})
export class PerformanceModule {}
