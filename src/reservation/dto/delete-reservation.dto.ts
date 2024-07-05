import { IsInt, IsNotEmpty } from "class-validator";


export class DeleteReservationDto {
    @IsInt()
    @IsNotEmpty({message: '예매 ID를 입력해주세요.'})
    reservationId: number;
}