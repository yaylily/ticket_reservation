import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformanceSchedule } from 'src/performance/entities/performanceSchedule.entity';
import { User } from 'src/user/entities/user.entity';
import { Tickets } from './entities/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PerformanceSchedule, User, Tickets])],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
