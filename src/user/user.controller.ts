import { UserInfo } from 'src/utils/userInfo.decorator';

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from './user.service';

///users 경로를 처리하는 컨트롤러
@Controller('users')
//UserService를 주입받아 사용자 관련 요청을 처리하는 컨트롤러 클래스
export class UserController {
  constructor(private readonly userService: UserService) {}

  ///'users/register' 경로의 POST 요청을 처리
  @Post('register')
  // 요청 바디를 LoginDto 타입으로 받아옵
  async register(@Body() registerDto: RegisterDto) {
    //UserService의 register 메서드를 호출하여 사용자 등록을 처리
    const userData = await this.userService.register(registerDto);
    return {
        status:201,
        message: '회원가입에 성공했습니다.',
        data: userData
    }
  }

  ///'user/login' 경로의 POST 요청을 처리
  @Post('login')
  //요청 바디를 LoginDto 타입으로 받아옴
  async login(@Body() loginDto: LoginDto) {
    //UserService의 login 메서드를 호출하여 사용자 로그인 처리
    const token = await this.userService.login(loginDto.email, loginDto.password);
    return {
        status: 201,
        message: '로그인에 성공했습니다.',
        data: token
    }
  }

  //JWT 인증 가드를 사용하여 인증된 요청만 처리
  @UseGuards(AuthGuard('jwt'))

  ///'user/profile' 경로의 GET 요청을 처리
  @Get('profile')
  //UserInfo 데코레이터를 사용하여 요청 객체에서 사용자 정보를 추출 후 인증된 사용자의 프로필을 반환
  async getProfile(@UserInfo() user) {
    const userData = await this.userService.getUserInfo(user.userId);
    return {
        status: 200,
        message: '내정보 조회에 성공했습니다.',
        data: userData
    }
  }
}