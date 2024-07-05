import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class CreateReservationDto {

    @IsInt()
    @IsNotEmpty({message:'공연 스케쥴 Id를 입력해주세요.'})
    performanceScheduleId: number;

    @IsInt()
    @IsPositive()
    @IsNotEmpty({message: '수량을 입력해주세요.'})
    quantity: number;
}
