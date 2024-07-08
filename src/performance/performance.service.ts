import _ from 'lodash';
import { parse } from 'papaparse';
import { Repository } from 'typeorm';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreatePerformanceDto } from './dto/create-performance.dto';
import { Performance } from './entities/performance.entity';
import { PerformanceSchedule } from './entities/performanceSchedule.entity';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(Performance)
    private readonly performanceRepository: Repository<Performance>,
    @InjectRepository(PerformanceSchedule)
    private readonly performanceScheduleRepository: Repository<PerformanceSchedule>,
  ) {}

  //공연 목록 조회 
  async findAll(category?: string, title?: string): Promise<Performance[]> {
    const query = this.performanceRepository.createQueryBuilder('performance')
      .select(['performance.performanceId', 'performance.title', 'performance.category','performance.img', 'performance.location', 'performance.price', 'performance.createdAt', 'performance.updatedAt'])
      .orderBy('performance.createdAt', 'DESC')
        
      //카테고리 분류
      if(category) {
        query.where('performance.category = :category', {category})
      }

      //공연명 검색
      if(title){
        query.andWhere('performance.title Like :title', {title: `%${title}%`})
      }

      return await query.getMany();
      }

  //공연 상세 조회
  async findOne(performanceId: number): Promise<Partial<Performance>> {
    const performance = await this.performanceRepository.findOne({
        where: {performanceId},
        relations: ['schedules']
    });

    if(!performance){
        throw new NotFoundException('공연을 찾을 수 없습니다.');
    }

    const AvailableSchedule = performance.schedules.map(schedule => ({
        ...schedule,
        isAvailable: schedule.remainingSeats>0
    }))

    return {
        performanceId: performance.performanceId,
        title: performance.title,
        description: performance.description,
        category: performance.category,
        location: performance.location,
        price: performance.price,
        img: performance.img,
        schedules: AvailableSchedule,
        createdAt: performance.createdAt,
        updatedAt: performance.updatedAt,
    };
  }


  //공연 등록
  async create(createPerformanceDto: CreatePerformanceDto): Promise<Performance> {
    const { title, description, category, location, price, img, schedules } = createPerformanceDto;
    
    const performance = this.performanceRepository.create({
        title, description, category, location, price, img });

    const savedPerformance = await this.performanceRepository.save(performance);

    const performanceSchedule = schedules.map(schedule =>
        this.performanceScheduleRepository.create({
            ...schedule,
            remainingSeats: schedule.totalSeats,
            performance: savedPerformance,
        })
        )
        const savedSchedules = await this.performanceScheduleRepository.save(performanceSchedule);

        savedPerformance.schedules = savedSchedules;

    return savedPerformance;
    }
}