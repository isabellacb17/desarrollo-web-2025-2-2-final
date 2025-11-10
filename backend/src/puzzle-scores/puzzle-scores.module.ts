import { Module } from '@nestjs/common';
import { PuzzleScoresController } from './puzzle-scores.controller';

@Module({
  controllers: [PuzzleScoresController],
})
export class PuzzleScoresModule {}


