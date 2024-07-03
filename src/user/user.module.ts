//사용자 관련 기능을 담당하는 컴포넌트들을 효과적으로 관리

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import {UserInfo} from './entities/userinfo.entity'
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    //비동기 방식으로 JWT 모듈을 설정
    JwtModule.registerAsync({
      //JWT 비밀 키를 동적으로 가져옴
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      //ConfigService를 팩토리 함수에 주입
      inject: [ConfigService],
    }),
    //User 엔티티를 사용하여 데이터베이스 연동을 설정
    TypeOrmModule.forFeature([User, UserInfo])
  ],
  //UserService를 프로바이더로 등록 - 이 모듈 내의 다른 컴포넌트에서 주입받아 사용할 수 있음
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}