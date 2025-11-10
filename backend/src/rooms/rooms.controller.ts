import { Controller, Get, Query } from '@nestjs/common';

@Controller('rooms')
export class RoomsController {
  @Get('slots')
  slots(@Query('roomId') roomId?: string) {
    // Datos ficticios para esqueleto
    const all = [
      { roomId: 'faraon', roomName: 'Faraón', start: '2025-11-15T14:00:00Z', end: '2025-11-15T15:00:00Z' },
      { roomId: 'faraon', roomName: 'Faraón', start: '2025-11-15T15:30:00Z', end: '2025-11-15T16:30:00Z' },
      { roomId: 'submarino', roomName: 'Submarino', start: '2025-11-15T16:00:00Z', end: '2025-11-15T17:00:00Z' },
      { roomId: 'laboratorio', roomName: 'Laboratorio', start: '2025-11-15T14:15:00Z', end: '2025-11-15T15:15:00Z' },
    ];
    return roomId ? all.filter(a => a.roomId === roomId) : all;
  }
}


