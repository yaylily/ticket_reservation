import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Performance } from './performance.entity';

@Entity({
    name: 'performance_schedules'
})
export class PerformanceSchedule {
    @PrimaryGeneratedColumn()
    performanceScheduleId: number;



    @Column({ type:'date', nullable: false})
    performanceDate: Date;

    @Column({ type:'time', nullable: false})
    performanceTime: string;

    @Column({ type:'int', nullable: false})
    totalSeats: number;

    @Column({ type:'int', nullable: false})
    remainingSeats: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP',  nullable: false })
  updatedAt: Date;

    @ManyToOne(() => Performance, performance => performance.schedules)
    performance: Performance;

}