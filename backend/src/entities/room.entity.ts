import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Session } from './session.entity';

@Entity('rooms')
export class Room {
  // Usamos ids semánticos para compatibilidad ('faraon', 'submarino', 'laboratorio')
  @PrimaryColumn()
  id!: string;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => Session, (s) => s.room)
  sessions!: Session[];
}


