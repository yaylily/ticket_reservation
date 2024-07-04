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
  async findAll(): Promise<Performance[]> {
    return await this.performanceRepository.find({
      select: ['performanceId', 'title', 'category', 'location', 'price', 'createdAt', 'updatedAt'],
      order: {
        createdAt: 'DESC'
      }
    });
  }

  //공연 상세 조회
  async findOne(performanceId: number): Promise<Performance> {
    return await this.performanceRepository.findOne({
        where: {performanceId: performanceId},
        relations: ['schedules']
    });
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
            performance: savedPerformance,
        })
        )
       await this.performanceScheduleRepository.save(performanceSchedule);

    return savedPerformance;
    }
}