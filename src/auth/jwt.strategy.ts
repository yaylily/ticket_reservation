import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

//JwtStrategy 클래스가 의존성 주입 가능하게 만드는 데코레이터
@Injectable()
//Passport의 JWT Strategy를 확장. Strategy는 passport-jwt에서 제공하는 JWT 인증 전략
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    //상위 클래스의 생성자를 호출. 여기서 JWT 관련 설정을 구성
    super({
        //토큰을 추출하는 방법을 정의 - HTTP 헤더에서 Bearer 토큰을 추출
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //토큰 만료를 무시할지 여부를 설정합니다. false로 설정하면 만료된 토큰은 거부
      ignoreExpiration: false,
      //ConfigService를 통해 환경 설정에서 비밀키를 가져옴
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  //JWT의 payload를 받아 추가적인 검증을 수행하거나 사용자 정보를 조회할 수 있는 메서드 -payload로 전달된 데이터를 통해 실제 유저 정보를 조회해야함
  async validate(payload: any) {

  }
}