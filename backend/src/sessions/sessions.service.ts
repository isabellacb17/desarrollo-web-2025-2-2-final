import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../entities/session.entity';
import { Room } from '../entities/room.entity';

export type CreateSessionDto = {
  roomId: string;
  userId: string;
  start: string; 
  end: string;   
};

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session) private readonly sessionRepo: Repository<Session>,
    @InjectRepository(Room) private readonly roomRepo: Repository<Room>,
  ) {}

  async findAll(params?: { roomId?: string; start?: string; end?: string }) {
    const { roomId, start, end } = params ?? {};
    const qb = this.sessionRepo.createQueryBuilder('s');
    if (roomId) qb.andWhere('s.roomId = :roomId', { roomId });
    if (start) qb.andWhere('s.endAt >= :start', { start: new Date(start) });
    if (end) qb.andWhere('s.startAt <= :end', { end: new Date(end) });
    qb.orderBy('s.startAt', 'ASC');
    return qb.getMany();
  }

  async book(dto: CreateSessionDto) {
    const start = new Date(dto.start).getTime();
    const end = new Date(dto.end).getTime();

    
    const roomOverlap = await this.sessionRepo
      .createQueryBuilder('s')
      .where('s.roomId = :roomId', { roomId: dto.roomId })
      .andWhere('(s.startAt < :end AND s.endAt > :start)', { 
        start: new Date(dto.start), 
        end: new Date(dto.end) 
      })
      .getOne();

    if (roomOverlap) {
      throw new BadRequestException({ 
        message: 'Session overlap', 
        code: 'SESSION_OVERLAP', 
        details: [{ conflictWithSessionId: roomOverlap.id }] 
      });
    }

    
    const userOverlap = await this.sessionRepo
      .createQueryBuilder('s')
      .where('s.userId = :userId', { userId: dto.userId })
      .andWhere('(s.startAt < :end AND s.endAt > :start)', { 
        start: new Date(dto.start), 
        end: new Date(dto.end) 
      })
      .getOne();

    if (userOverlap) {
      throw new BadRequestException({ 
        message: 'Session overlap', 
        code: 'SESSION_OVERLAP', 
        details: [{ conflictWithSessionId: userOverlap.id }] 
      });
    }

    const room = await this.roomRepo.findOne({ where: { id: dto.roomId } });
    if (!room) {
      throw new BadRequestException({ message: 'Invalid room', code: 'INVALID_ROOM' });
    }
    const entity = this.sessionRepo.create({
      id: Math.round(Math.random() * 1e9).toString(36),
      roomId: dto.roomId,
      userId: dto.userId,
      startAt: new Date(dto.start),
      endAt: new Date(dto.end),
    });
    const saved = await this.sessionRepo.save(entity);
    return { id: saved.id };
  }
}
