import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformanceSchedule } from 'src/performance/entities/performanceSchedule.entity';
import { User } from 'src/user/entities/user.entity';
import { Reservation } from './entities/reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PerformanceSchedule, User, Reservation])],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
