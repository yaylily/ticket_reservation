import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PerformanceSchedule } from 'src/performance/entities/performanceSchedule.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Tickets } from './entities/ticket.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(PerformanceSchedule)
    private readonly performanceScheduleRepository: Repository<PerformanceSchedule>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tickets)
    private readonly ticketRepository: Repository<Tickets>
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

    const result = await this.ticketRepository.manager.transaction(async transactionalEntityManager => {
      user.points -= totalCost;
      schedule.remainingSeats -= quantity;

      await transactionalEntityManager.save(user);
      await transactionalEntityManager.save(schedule);

      const ticket = this.ticketRepository.create({
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
    const reservations = await this.ticketRepository.find({
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
}
