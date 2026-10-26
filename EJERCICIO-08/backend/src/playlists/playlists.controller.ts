// playlists.controller.ts
import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreateCancionDto } from './create-cancion.dto';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly service: PlaylistsService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post(':id/canciones')
  addCancion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCancionDto,
  ) {
    return this.service.addCancion(id, dto);
  }
}