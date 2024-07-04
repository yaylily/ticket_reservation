//JWT를 이용한 인증 기능을 애플리케이션에 통합할 때 기본적인 설정을 제공

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
//인증을 위한 NestJS의 Passport 모듈
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';

import { JwtStrategy } from './jwt.strategy';

//클래스를 NestJS 모듈로 선언하는 데코레이터
@Module({
  imports: [
    //모듈이 사용할 기본 인증 전략으로 'jwt'를 지정, 세션 기반 인증 사용하지 않음
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    //비동기적으로 JWT 모듈 설정 - 설정 정보를 비동기적으로 로드,환경 설정 서비스 등 외부 서비스를 이용해야 할 때 유용
    JwtModule.registerAsync({
        //ConfigService를 사용하여 JWT_SECRET_KEY 환경 변수를 읽어 JWT의 secret을 설정
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      //팩토리 함수에 주입할 프로바이더를 배열로 지정 - ConfigService가 주입되어 환경 변수에 접근할 수 있음
      inject: [ConfigService],
    }),
    UserModule,
  ],
  //JwtStrategy 클래스를 모듈의 프로바이더로 포함 - 모듈이 이 전략을 의존성 주입을 통해 사용할 수 있게 해줌
  providers: [JwtStrategy],
})
export class AuthModule {}