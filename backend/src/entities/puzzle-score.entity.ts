import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Session } from './session.entity';

@Entity('puzzle_scores')
export class PuzzleScore {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Session, { eager: true })
  session!: Session;

  @Column()
  sessionId!: string;

  @Column()
  attempt!: number;

  @Column()
  score!: number;

  @Column({ default: false })
  isFinal!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}


