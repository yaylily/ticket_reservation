import { compare, hash } from 'bcrypt';
//유틸리티 라이브러리로, 여기서는 isNil 함수를 사용
import _ from 'lodash';
import { Repository } from 'typeorm';

import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserInfo } from './entities/userinfo.entity';
import { RegisterDto } from './dto/register.dto';
import { userInfo } from 'os';

//의존성 주입이 가능한 서비스 클래스
@Injectable()
export class UserService {
    //생성자에서 User/UserInfo 엔티티를 사용하는 userRepository, userInfoRepository와 JWT 서비스를 주입
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
    private readonly jwtService: JwtService,
  ) {}

  //사용자 등록
  async register(registerDto: RegisterDto) {
    const { email, password, passwordConfirm, name, nickname, phone, address } = registerDto;

    //이메일로 기존 사용자가 있는지 확인
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(
        '이미 해당 이메일로 가입된 사용자가 있습니다!',
      );
    }

    //비밀번호와 비밀번호 확인이 일치하는지 확인
    if(password !== passwordConfirm) {
        throw new BadRequestException('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    }

    //비밀번호를 해시화하여 이메일과 함께 데이터베이스에 저장
    const hashedPassword = await hash(password, 10);
    const user = await this.userRepository.save({
      email,
      password: hashedPassword,
    });

    //사용자 정보 데이터베이스에 저장
    const userInfo = await this.userInfoRepository.save({
        user,
        name,
        nickname,
        phone,
        address
    })

    return {

            id: user.userId,
            email: user.email,
            name: userInfo.name,
            nickname: userInfo.nickname,
            phone: userInfo.phone,
            address: userInfo.address,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
    };
  }

  //로그인 기능
  async login(email: string, password: string) {
    //이메일로 사용자를 찾는다
    const user = await this.userRepository.findOne({
      select: ['userId', 'email', 'password'],
      where: { email },
    });
    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    //비밀번호를 검증
    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    //JWT 토큰을 생성하여 반환
    const payload = { email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  //내 프로필 조회
  async getUserInfo(userId: number) {
    const user = await this.userRepository.findOne({
        where: {userId},
        relations: ['userInfo'],
        select: ['userId', 'email', 'points', 'role', 'createdAt', 'updatedAt']
    });

    if(!user){
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const userInfo = await this.userInfoRepository.findOne({
        where:{user: {userId}}
    })

    if(!userInfo){
        throw new NotFoundException('사용자 정보를 찾을 수 없습니다.');
    }

    return {

            userId: user.userId,
            email: user.email,
            name: userInfo.name,
            nickname: userInfo.nickname,
            points: user.points,
            role: user.role,
            phone: userInfo.phone,
            address: userInfo.address,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        
    }
  }
}