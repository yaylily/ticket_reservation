//사용자 역할 기반의 접근 제어를 구현
import { Role } from 'src/user/types/userRole.type';

import { SetMetadata } from '@nestjs/common';

//여러 개의 역할을 인자로 받아, 이를 'roles' 키에 메타데이터로 설정
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
//...roles: Role[]: Rest 파라미터 문법을 사용하여 여러 개의 역할을 인자로 받음
//SetMetadata('roles', roles): 'roles' 키에 받은 역할 배열을 메타데이터로 설정