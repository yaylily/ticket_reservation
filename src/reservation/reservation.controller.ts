import { Controller, Post, Body,  UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('performances')
@UseGuards(AuthGuard('jwt'))
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  //공연 예매
  @Post(':performanceId/tickets')
  async reservatePerformance(@UserInfo() user: User, @Body() createReservationDto: CreateReservationDto){
    const ticket = await this.reservationService.reservePerformance(user, createReservationDto);
    return {
      status: 201,
      message: '공연 예매에 성공했습니다.',
      data : ticket
    }
  }

}
