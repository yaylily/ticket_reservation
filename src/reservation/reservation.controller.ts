import { Controller, Post, Body,  UseGuards, Get, Delete, Param } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller()
@UseGuards(AuthGuard('jwt'))
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  //공연 예매
  @Post('performances/:performanceId/reservations')
  async reservatePerformance(@UserInfo() user: User, @Body() createReservationDto: CreateReservationDto){
    const ticket = await this.reservationService.reservePerformance(user, createReservationDto);
    return {
      status: 201,
      message: '공연 예매에 성공했습니다.',
      data : ticket
    }
  }

  //예약 목록 조회
  @Get('my/reservations')
  async getReservations(@UserInfo() user: User) {
    const reservations = await this.reservationService.findReservations(user);
    return{
      status: 200,
      message: '예매 목록 조회에 성공했습니다.',
      data: reservations
    }
  }

  //예매 취소
  @Delete('my/reservations/:reservationId')
  async deleteReservation(@UserInfo() user: User, @Param('reservationId') reservationId: number){
    const result = await this.reservationService.deleteReservation(user, reservationId);
    return {
      status: 200,
      message: '예매가 취소되었습니다.',
      data: result
    }
  }
}
