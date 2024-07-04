import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserInfo = createParamDecorator(
    //data: 데코레이터에 전달된 데이터, ctx: ExecutionContext 현재 실행 문맥에 대한 정보 제공
  (data: unknown, ctx: ExecutionContext) => {
    //현재 HTTP 요청 객체를 가져옴
    const request = ctx.switchToHttp().getRequest();
    //요청 객체에 user 속성이 있으면 이를 반환, 없으면 null을 반환
    return request.user ? request.user : null;
  },
);