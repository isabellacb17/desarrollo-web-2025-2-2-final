import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entities/room.entity';
import { Session } from '../entities/session.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Room) private readonly roomRepo: Repository<Room>,
    @InjectRepository(Session) private readonly sessionRepo: Repository<Session>,
  ) {}

  async onModuleInit() {
    await this.seedRooms();
    await this.seedSessions();
  }

  private async seedRooms() {
    const count = await this.roomRepo.count();
    if (count > 0) return;
    await this.roomRepo.insert([
      { id: 'faraon', name: 'Faraón' },
      { id: 'submarino', name: 'Submarino' },
      { id: 'laboratorio', name: 'Laboratorio' },
    ]);
  }

  private async seedSessions() {
    const count = await this.sessionRepo.count();
    if (count > 0) return;
    await this.sessionRepo.insert([
      {
        id: 's1',
        roomId: 'faraon',
        userId: 'u-seed-1',
        startAt: new Date('2025-11-15T14:00:00Z'),
        endAt: new Date('2025-11-15T15:00:00Z'),
      },
      {
        id: 's2',
        roomId: 'submarino',
        userId: 'u-seed-2',
        startAt: new Date('2025-11-15T16:00:00Z'),
        endAt: new Date('2025-11-15T17:00:00Z'),
      },
      {
        id: 's3',
        roomId: 'faraon',
        userId: 'u-seed-3',
        startAt: new Date('2025-11-15T14:30:00Z'),
        endAt: new Date('2025-11-15T15:30:00Z'),
      },
      {
        id: 's4',
        roomId: 'laboratorio',
        userId: 'u-seed-1',
        startAt: new Date('2025-11-15T14:15:00Z'),
        endAt: new Date('2025-11-15T14:45:00Z'),
      },
    ]);
  }
}


