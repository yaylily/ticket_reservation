import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Category } from '../types/performanceCategory.type';
import { Type } from 'class-transformer'

class PerformanceScheduleDto {
    @IsDate()
    @Type(() => Date)
    @IsNotEmpty({ message: '공연 날짜를 입력해주세요.' })
    performanceDate: Date;

    @IsString()
    @IsNotEmpty({ message: '공연 시간을 입력해주세요.' })
    performanceTime: string;

    @IsNumber()
    @IsNotEmpty({ message: '전체 좌석수를 넣어주세요.' })
    totalSeats:number;

    @IsNumber()
    remainingSeats?: number;

}

export class CreatePerformanceDto {
  @IsString()
  @IsNotEmpty({ message: '공연명을 입력해주세요.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '공연 설명을 입력해주세요.' })
  description: string;

  @IsEnum(Category, {message: '유효한 카테고리를 입력해주세요.'})
  @IsNotEmpty({ message: '카테고리를 입력해주세요.'})
  category: Category;

  @IsString()
  @IsNotEmpty({ message: '공연 장소를 입력해주세요.' })
  location: string;

  @IsNumber()
  @IsNotEmpty({ message: '공연 가격을 입력해주세요.' })
  price: number;

  @IsString()
  @IsNotEmpty({ message: '이미지를 넣어주세요.' })
  img: string;

  @IsArray()
  @Type(() => PerformanceScheduleDto)
  schedules: PerformanceScheduleDto[]

}
