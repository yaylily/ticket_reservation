import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/user/types/userRole.type';

import {
  Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreatePerformanceDto } from './dto/create-performance.dto';
import { PerformanceService } from './performance.service';


@Controller('performances')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  //공연 목록 조회
  @Get()
  async findAll() {
    const performances = await this.performanceService.findAll();
    return {
        status: 200,
        message: '공연 목록 조회에 성공했습니다.',
        data: performances
    }
  }

  //공연 상세 조회
  @Get(':performanceId')
  async findOne(@Param('performanceId') performanceId: number) {
    const performance = await this.performanceService.findOne(performanceId);
    return {
        status: 200,
        message: '공연 상세 조회에 성공했습니다.',
        data: performance
    }
  }

  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() createPerformanceDto: CreatePerformanceDto) {
    const performance = await this.performanceService.create(createPerformanceDto);
    return {
        status: 201,
        message: '공연 등록에 성공했습니다.',
        data: performance,
    }
  }
}