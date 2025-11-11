import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { CreatePuzzleScoreDto } from './dto/create-puzzle-score.dto';
import { RolesGuard } from '../auth/roles.guard';

@Controller('puzzle-scores')
@UseGuards(RolesGuard)
export class PuzzleScoresController {
  @Post()
  @SetMetadata('roles', ['gm'])
  create(@Body() _dto: CreatePuzzleScoreDto) {
    // TODO: Implementar guardado real (TypeORM). Aquí devolvemos eco para esqueleto.
    return { ok: true };
  }
}