import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity('sessions')
@Index(['roomId', 'startAt'])
@Index(['roomId', 'endAt'])
@Index(['userId', 'startAt'])
@Index(['userId', 'endAt'])
export class Session {
  @PrimaryColumn()
  id!: string;

  @Column()
  roomId!: string;

  @ManyToOne(() => Room, (r) => r.sessions, { eager: true })
  room!: Room;

  @Column()
  userId!: string;

  @Column({ type: 'datetime' })
  startAt!: Date;

  @Column({ type: 'datetime' })
  endAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}


