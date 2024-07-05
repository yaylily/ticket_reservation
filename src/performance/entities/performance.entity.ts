import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../types/performanceCategory.type';
import { PerformanceSchedule } from './performanceSchedule.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';

@Entity({
  name: 'performances',
})
export class Performance {
  @PrimaryGeneratedColumn()
  performanceId: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'enum', enum: Category, nullable: false })
  category: Category;

  @Column({ type: 'varchar', nullable: false })
  location: string;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'varchar', nullable: false })
  img: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP',  nullable: false })
  updatedAt: Date;

  @OneToMany(() => PerformanceSchedule, schedule => schedule.performance)
  schedules: PerformanceSchedule[];

  @OneToMany(() => Reservation, reservation => reservation.performance)
  tickets: Reservation[];

}