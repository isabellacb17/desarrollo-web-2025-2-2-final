import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import type { CreateSessionDto } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly service: SessionsService) {}

  @Get()
  list(
    @Query('roomId') roomId?: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    return this.service.findAll({ roomId, start, end });
  }

  @Post('book')
  book(@Body() dto: CreateSessionDto) {
    return this.service.book(dto);
  }

}


