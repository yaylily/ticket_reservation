# Ticket Reservation System
티켓 예매 사이트 만들기

## 프로젝트 개요
Ticket Reservation System은 사용자들이 다양한 공연을 검색하고 예매할 수 있는 웹 애플리케이션입니다. 사용자는 공연의 상세 정보를 확인하고, 날짜와 시간을 선택하여 예매할 수 있습니다.

## 주요 기능
- 공연 목록 조회
- 공연 상세 조회
- 공연 예매
- 예매 내역 조회
- 예매 취소

## 기술 스택
- **Backend:** NestJS, TypeScript, TypeORM, MySQL
- **Authentication:** JWT (JSON Web Tokens)

## 설치 및 실행

### 1. 클론 저장소
```bash
git clone https://github.com/yaylily/ticket_reservation.git
cd ticket_reservation
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
프로젝트 루트 디렉토리에 `.env` 파일을 생성하고, 다음 내용을 추가하세요:
```env
JWT_SECRET_KEY=your_jwt_secret_key
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_NAME=your_db_name
DB_SYNC=true
```

### 4. 데이터베이스 설정 및 마이그레이션
TypeORM을 사용하여 데이터베이스를 설정하고, 필요한 엔티티와 테이블을 생성합니다.

### 5. 서버 실행
```bash
npm run start
```

## API 명세서

### 인증

#### 회원가입
- **URL:** `/users/sign-up`
- **Method:** `POST`
- **인증:** `PUBLIC`

#### 로그인
- **URL:** `/users/login`
- **Method:** `POST`
- **인증:** `PUBLIC`

### 사용자

#### 내 정보 조회
- **URL:** `/users/profile`
- **Method:** `GET`
- **인증:** `AccessToken`
- **접근 권한:** `USER`

### 공연

#### 공연 등록
- **URL:** `/performances`
- **Method:** `POST`
- **인증:** `AccessToken`
- **접근 권한:** `ADMIN`
- **Body:**
  ```json
  {
  "title": "공연 제목",
  "description": "공연 설명",
  "category": "공연 카테고리",
  "location": "공연 장소",
  "price": 공연 가격,
  "img": "이미지 URL",
  "schedules": [
    {
      "performanceDate": "공연 날짜 (YYYY-MM-DD)",
      "performanceTime": "공연 시간 (HH:mm)",
      "totalSeats": 전체 좌석 수
    },
    {
      "performanceDate": "공연 날짜 (YYYY-MM-DD)",
      "performanceTime": "공연 시간 (HH:mm)",
      "totalSeats": 전체 좌석 수
    }
  ]
  }

#### 공연 목록 조회
- **URL:** `/performances`
- **Method:** `GET`
- **인증:** `PUBLIC`

#### 공연 검색
- **URL:** `/performances`
- **Method:** `GET`
- **인증:** `PUBLIC`
- **Query Parameters:**
  - `category` (optional): 특정 카테고리의 공연을 조회합니다.
  - `title` (optional): 공연명을 기준으로 검색합니다.

#### 공연 상세 조회
- **URL:** `/performances/:performanceId`
- **Method:** `GET`
- **인증:** `PUBLIC`

### 예매

#### 공연 예매
- **URL:** `/performances/:performanceId/reservations`
- **Method:** `POST`
- **인증:** `AccessToken`
- **접근 권한:** `USER`
- **Body:**
  ```json
  {
  "performanceScheduleId": 공연 스케줄 ID,
  "quantity": 예매 수량
  }

#### 예매 목록 조회
- **URL:** `/performances/reservations`
- **Method:** `GET`
- **인증:** `AccessToken`
- **접근 권한:** `USER`

#### 예매 취소
- **URL:** `/performances/reservations/:reservationId`
- **Method:** `DELETE`
- **인증:** `AccessToken`
- **접근 권한:** `USER`

