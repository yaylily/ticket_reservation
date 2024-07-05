//데이터베이스와 환경 설정을 안전하고 효율적으로 관리하기 위한 기초 제공
import Joi from 'joi';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
//NestJS Module 관련
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
//TypeOrmModule: TypeORM을 사용하여 데이터베이스 연결 및 ORM 기능을 NestJS에 통합하는 모듈.
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { UserInfo } from './user/entities/userinfo.entity';
import { PerformanceModule } from './performance/performance.module';
import { PerformanceSchedule } from './performance/entities/performanceSchedule.entity';
import { Performance} from './performance/entities/performance.entity'
import { ReservationModule } from './reservation/reservation.module';
import { Reservation } from './reservation/entities/reservation.entity';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    //'entities' 데이터베이스 테이블과 매핑될 엔티티 클래스들을 배열로 명시
    entities: [User, UserInfo, Performance, PerformanceSchedule, Reservation],
    //'synchronize' 엔티티 정보를 바탕으로 데이터베이스 스키마를 자동으로 동기화할지 여부를 결정
    synchronize: configService.get('DB_SYNC'),
    //데이터베이스 작업 로그 활성화
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    //forRoot 메서드를 사용하여 환경 변수를 애플리케이션 전역에서 사용할 수 있도록 설정
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    AuthModule,
    UserModule,
    PerformanceModule,
    ReservationModule,
  ],
  //애플리케이션의 컨트롤러와 서비스(프로바이더)를 여기에 추가할 수 있음
  controllers: [],
  providers: [],
})
export class AppModule {}