import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PerformanceSchedule } from 'src/performance/entities/performanceSchedule.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { DeleteReservationDto } from './dto/delete-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import moment from 'moment';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(PerformanceSchedule)
    private readonly performanceScheduleRepository: Repository<PerformanceSchedule>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>
  ) {}

  //공연 예매
  async reservePerformance(user: User, createReservationDto: CreateReservationDto) {
    const { performanceScheduleId, quantity } = createReservationDto;

    const schedule = await this.performanceScheduleRepository.findOne({
      where: {performanceScheduleId},
      relations: ['performance']
    });
    
    if(!schedule) {
      throw new NotFoundException('공연 스케쥴을 찾을 수 없습니다.');
    }

    if(schedule.remainingSeats < quantity) {
      throw new ConflictException('남은 좌석 수가 부족합니다.')
    }

    const totalCost = schedule.performance.price * quantity;
    if( user.points < totalCost) {
      throw new BadRequestException('포인트가 부족합니다.')
    }

    const result = await this.reservationRepository.manager.transaction(async transactionalEntityManager => {
      user.points -= totalCost;
      schedule.remainingSeats -= quantity;

      await transactionalEntityManager.save(user);
      await transactionalEntityManager.save(schedule);

      const ticket = this.reservationRepository.create({
        user: user,
        performance: schedule.performance,
        performanceSchedule: schedule,
        quantity: quantity,
        paidPoints: totalCost
      })

      await transactionalEntityManager.save(ticket)

      return {
        title: schedule.performance.title,
        location: schedule.performance.location,
        price: schedule.performance.price,
        quantity,
        totalCost,
        performanceDate: schedule.performanceDate,
        performanceTime: schedule.performanceTime
      }
    })
    return result
  }

  //예매 조회 기능
  async findReservations(user: User) {
    const reservations = await this.reservationRepository.find({
      where: { user: user },
      relations: ['performance', 'performanceSchedule'],
      order: {createdAt: 'DESC'}
    })

    return reservations.map(reservation => ({
      title: reservation.performance.title,
      location:reservation.performance.location,
      price: reservation.performance.price,
      quantity: reservation.quantity,
      totalCost: reservation.paidPoints,
      performanceDate: reservation.performanceSchedule.performanceDate,
      performanceTime: reservation.performanceSchedule.performanceTime,
      reservationDate: reservation.createdAt
    }))
  }
      //예매 취소 기능
    async deleteReservation( user: User, reservationId: number){
      const reservation  = await this.reservationRepository.findOne({
        where: { reservationId, user },
        relations: ['performanceSchedule', 'performance']
      })

      if(!reservation){
        throw new NotFoundException('예매 내역을 찾을 수 없습니다.')
      }

      const currentDateTime = moment();
      const performanceDateTime = moment(reservation.performanceSchedule.performanceDate + ' ' + reservation.performanceSchedule.performanceTime)

      if (performanceDateTime.diff(currentDateTime, 'hours') < 3) {
        throw new BadRequestException('공연 시작 3시간 전까지만 예매를 취소할 수 있습니다.')
      }

      await this.reservationRepository.manager.transaction(async transactionalEntityManager => {
        user.points += reservation.paidPoints;
        reservation.performanceSchedule.remainingSeats += reservation.quantity;

        await transactionalEntityManager.save(user);
        await transactionalEntityManager.save(reservation.performanceSchedule)
        await transactionalEntityManager.remove(reservation)
      });

      return {
        refundedPoints: reservation.paidPoints
      }
    }

}
