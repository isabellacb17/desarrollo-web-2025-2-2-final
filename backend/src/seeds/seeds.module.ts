import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../entities/room.entity';
import { Session } from '../entities/session.entity';
import { PuzzleScore } from '../entities/puzzle-score.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Session, PuzzleScore])],
  providers: [SeedService],
})
export class SeedsModule {}


