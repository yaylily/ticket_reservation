import { PerformanceSchedule } from "src/performance/entities/performanceSchedule.entity";
import { User } from "src/user/entities/user.entity";
import { Performance } from 'src/performance/entities/performance.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('reservations')
export class Reservation {
    @PrimaryGeneratedColumn()
    reservationId:number;

    @ManyToOne(() => User, user => user.tickets)
    user: User;

    @ManyToOne(() => Performance, performance => performance.reservations)
    performance: Performance;

    @ManyToOne(() => PerformanceSchedule, performanceSchedule => performanceSchedule.reservations)
    performanceSchedule: PerformanceSchedule;

    @Column({ type: 'int', nullable: false})
    quantity: number;

    @Column({ type: 'int', nullable: false})
    paidPoints: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP, nullable: false'})
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate:'CURRENT_TIMESTAMP' , nullable: false})
    updatedAt: Date;
}