import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  //AppModule을 사용하여 Nest 애플리케이션 인스턴스를 비동기적으로 생성
  const app = await NestFactory.create(AppModule);

  //애플리케이션의 모든 컨트롤러와 라우트에 대해 유효성 검사 파이프가 작동하게 함
  app.useGlobalPipes(
    //요청에서 받은 데이터를 DTO에 선언된 타입으로 자동 변환.
    new ValidationPipe({
      transform: true,
    }),
  );

  //NestJS 서버가 3000 포트에서 수신 대기하도록 설정
  await app.listen(3000);
}

bootstrap();