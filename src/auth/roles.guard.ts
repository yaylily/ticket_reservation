//JWT 인증을 기반으로 역할 기반 접근 제어. AuthGuard('jwt')를 확장하여 사용자의 인증을 처리하고, 사용자의 역할을 확인하여 접근 제어
import { Role } from 'src/user/types/userRole.type';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
    //주로 데코레이터 메타데이터를 읽어올 때 사용
  constructor(private reflector: Reflector) {
    //AuthGuard('jwt')의 생성자 호출. RolesGuard는 AuthGuard의 기능을 상속받아 JWT 기반 인증을 수행
    super();
  }

  //요청이 처리되기 전에 호출되며, 사용자가 인증되었는지와 요청된 역할을 가지고 있는지를 확인
  async canActivate(context: ExecutionContext) {
    const authenticated = await super.canActivate(context);
    if (!authenticated) {
      return false;
    }

    //핸들러와 클래스에 설정된 역할을 가져옴
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
        //현재 요청된 핸들러(메서드)
      context.getHandler(),
      // 현재 요청된 클래스(컨트롤러)를 의미
      context.getClass(),
    ]);
    //역할이 설정되지 않은 경우, 접근 허용
    if (!requiredRoles) {
      return true;
    }

    //사용자 역할 확인
    //요청 객체를 가져오고, 사용자 정보를 추출
    const { user } = context.switchToHttp().getRequest();
    //사용자가 요청된 역할 중 하나를 가지고 있는지 확인
    return requiredRoles.some((role) => user.role === role);
  }
}